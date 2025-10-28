#!/usr/bin/env python3
"""
MQTT Sensor Data Simulator

Publishes simulated sensor readings to an MQTT broker so the Biogestor app can be tested
without physical sensors. The backend consumer subscribes to topic "Prueba" on localhost:1883
and expects numeric fields like:
- presion (hPa)
- caudal_gas (m^3 increment per tick)
- caudal_biol (m^3 increment per tick)
- temperatura (°C)
- humedad (%)
- calidad (%)  # opcional, pureza CH4, etc.

By default this script publishes to mqtt://localhost:1883 on topic "Prueba" at 1 Hz.
You can change parameters via CLI args.

Example:
    # Enviar incrementos (delta) por tick
    python3 scripts/mqtt_simulator.py --topic Prueba --interval 1.0 --duration 300 --mode delta

    # Enviar acumulados (cumulative) en m3 desde el inicio
    python3 scripts/mqtt_simulator.py --topic Prueba --interval 1.0 --duration 300 --mode cumulative

    # Enviar ambos: delta por tick y acumulados
    python3 scripts/mqtt_simulator.py --topic Prueba --interval 1.0 --duration 300 --mode both
"""
from __future__ import annotations
import argparse
import json
import math
import random
import signal
import sys
import time
from typing import Dict

import paho.mqtt.client as mqtt


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="MQTT sensor data simulator")
    parser.add_argument("--broker", default="localhost", help="MQTT broker host (default: localhost)")
    parser.add_argument("--port", type=int, default=1883, help="MQTT broker port (default: 1883)")
    parser.add_argument("--topic", default="Prueba", help="MQTT topic to publish (default: Prueba)")
    parser.add_argument("--interval", type=float, default=1.0, help="Seconds between messages (default: 1.0)")
    parser.add_argument("--duration", type=float, default=0.0, help="Total run time in seconds (0 = infinite)")
    parser.add_argument("--client-id", default="biogestor-sim", help="MQTT client id (default: biogestor-sim)")
    parser.add_argument("--seed", type=int, default=None, help="RNG seed for reproducibility")
    parser.add_argument(
        "--mode",
        choices=["delta", "cumulative", "both"],
        default="both",
        help="Qué publicar: incrementos por tick (delta), acumulados desde inicio (cumulative) o ambos (both). Default: both",
    )
    return parser.parse_args()


def make_payload(t: float, dt: float, *, accumulators: Dict[str, float], mode: str) -> Dict[str, float]:
    """Generate a realistic-ish set of simulated readings.

    - temperatura: around 35°C with slow sinusoidal drift
    - humedad: around 60% ± 10%
    - presion: around 1006 hPa ± 8
    - caudal_gas: incremental m^3 for this tick, based on a smooth varying rate
    - caudal_biol: small incremental m^3 per tick
    - calidad: optional methane content percentage ~ 60 ± 5

    The backend currently sums gas_flow values per day. To make daily totals realistic,
    we emit "incremental volume" (m^3) each tick: delta = rate_m3_per_h * dt / 3600.
    """
    # Smooth base oscillations
    temp = 35.0 + 2.0 * math.sin(2 * math.pi * (t / 3600.0))  # 1h cycle, ±2°C
    temp += random.uniform(-0.2, 0.2)

    hum = 60.0 + 10.0 * math.sin(2 * math.pi * (t / 1800.0))  # 30m cycle
    hum += random.uniform(-2.0, 2.0)

    pres = 1006.0 + 8.0 * math.sin(2 * math.pi * (t / 7200.0))  # 2h cycle
    pres += random.uniform(-1.0, 1.0)

    # Biogas production rate (m3/h): base 0.5 m3/h with daily pattern
    rate_base = 0.5  # ~12 m3/day
    rate_variation = 0.15 * math.sin(2 * math.pi * (t / 86400.0))  # daily cycle
    rate_noise = random.uniform(-0.05, 0.05)
    rate_m3_per_h = max(0.0, rate_base + rate_variation + rate_noise)

    caudal_gas_delta = rate_m3_per_h * (dt / 3600.0)  # m3 this tick

    # Biol outflow, much smaller, e.g., 0.05 m3/h average
    biol_rate = max(0.0, 0.05 + 0.02 * math.sin(2 * math.pi * (t / 43200.0)) + random.uniform(-0.01, 0.01))
    caudal_biol_delta = biol_rate * (dt / 3600.0)

    calidad = 60.0 + random.uniform(-5.0, 5.0)

    payload: Dict[str, float] = {
        "temperatura": round(temp, 2),
        "humedad": round(hum, 2),
        "presion": round(pres, 2),
        "calidad": round(calidad, 1),
    }

    # Actualizar acumuladores
    accumulators.setdefault("gas_total_m3", 0.0)
    accumulators.setdefault("biol_total_m3", 0.0)
    accumulators["gas_total_m3"] += max(0.0, caudal_gas_delta)
    accumulators["biol_total_m3"] += max(0.0, caudal_biol_delta)

    if mode in ("delta", "both"):
        payload["caudal_gas"] = round(caudal_gas_delta, 5)
        payload["caudal_biol"] = round(caudal_biol_delta, 5)

    if mode in ("cumulative", "both"):
        payload["gas_total_m3"] = round(accumulators["gas_total_m3"], 5)
        payload["biol_total_m3"] = round(accumulators["biol_total_m3"], 5)

    return payload


def main() -> int:
    args = parse_args()
    if args.seed is not None:
        random.seed(args.seed)

    client = mqtt.Client(client_id=args.client_id, clean_session=True)

    def on_connect(cl, userdata, flags, rc):
        if rc == 0:
            print(f"[MQTT] Connected to {args.broker}:{args.port}")
        else:
            print(f"[MQTT] Connection failed with rc={rc}")

    client.on_connect = on_connect

    try:
        client.connect(args.broker, args.port, keepalive=60)
    except Exception as e:
        print(f"[MQTT] Error connecting: {e}")
        return 1

    client.loop_start()

    running = True
    accumulators: Dict[str, float] = {"gas_total_m3": 0.0, "biol_total_m3": 0.0}

    def handle_sigint(signum, frame):
        nonlocal running
        running = False
        print("\n[MQTT] Stopping simulator...")

    signal.signal(signal.SIGINT, handle_sigint)
    signal.signal(signal.SIGTERM, handle_sigint)

    t0 = time.time()
    last = t0
    try:
        while running:
            now = time.time()
            elapsed = now - t0
            dt = now - last
            last = now

            payload = make_payload(
                t=elapsed,
                dt=max(dt, 1e-6),
                accumulators=accumulators,
                mode=args.mode,
            )
            msg = json.dumps(payload)
            client.publish(args.topic, msg, qos=0, retain=False)
            print(f"[MQTT] {args.topic} -> {msg}")

            if args.duration and (elapsed >= args.duration):
                break

            time.sleep(max(0.0, args.interval))
    finally:
        client.loop_stop()
        client.disconnect()
        print("[MQTT] Disconnected")

    return 0


if __name__ == "__main__":
    sys.exit(main())
