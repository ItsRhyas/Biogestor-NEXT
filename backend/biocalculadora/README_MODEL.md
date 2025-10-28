# Modelo matemático para biodigestores de bolsa

Este proyecto usa un modelo cinético de Gompertz modificado para estimar la producción de biogás en biodigestores de bolsa, ajustado por temperatura (regla Q10) y saturación tipo Monod por concentración de sólidos volátiles (VS).

## Ecuaciones

Producción acumulada de biogás (m³):

$$
G(t) = A\, \exp\Big(-\exp\big(\tfrac{\mu_g e}{A}(\lambda - t) + 1\big)\Big)
$$

Producción diaria (derivada de Gompertz):

$$
G'(t) = A\, e^{-\exp(\cdot)}\, \exp(\cdot)\, \left(\tfrac{\mu_g e}{A}\right)
\quad\text{donde } (\cdot) = \tfrac{\mu_g e}{A}(\lambda - t) + 1
$$

Ajuste de velocidad por temperatura (regla Q10):

$$
\mu_{max}(T) = \mu_{ref} \; Q10^{\frac{T - T_{ref}}{10}}
$$

Saturación tipo Monod por concentración $S$ (kg VS/m³):

$$
\mu_{eff} = \mu_{max} \frac{S}{K_s + S}
$$

Se define $\mu_g = \mu_{eff}\,A$ como velocidad aparente a nivel de potencial de biogás.

El potencial de metano a partir de VS:

$$
A_{CH4} = Y\, (\text{kg VS/día}) \qquad A = \frac{A_{CH4}}{f_{CH4}}
$$

La simulación se detiene cuando $G(t)$ alcanza una fracción objetivo $\alpha A$ (típicamente $\alpha=0.95$), lo que induce una duración variable según condiciones iniciales.

## Parámetros por tipo de materia

- Bovino: $Y=0.25\;m^3\,CH_4/kg\,VS$, $f_{CH4}=0.60$, $\lambda=2.5\,d$, $\mu_{ref}=0.25\,d^{-1}$
- Porcino: $Y=0.28$, $f_{CH4}=0.62$, $\lambda=2.0$, $\mu_{ref}=0.30$
- Vegetal: $Y=0.20$, $f_{CH4}=0.55$, $\lambda=3.0$, $\mu_{ref}=0.20$

Parámetros globales (por defecto): $T_{ref}=35\,°C$, $Q10=1.07$, $K_s=2.0\,kg/m^3$.

## Referencias

- Mata-Alvarez, J. (2003). Anaerobic Digestion of Organic Wastes: The Biogas Process.
- Kafle, G. K., & Kim, S. H. (2013). Anaerobic digestion of cattle manure: A modified Gompertz model.
- Karki, S. S., et al. (2005). Biogas production in bag digesters: kinetics and performance. Renewable Energy.
