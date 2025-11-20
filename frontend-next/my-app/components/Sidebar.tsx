import {
  Contact,
  ChartSpline,
  Calculator,
  ClipboardList,
  BotMessageSquare,
  UsersRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Perfil",
    url: "profiles",
    icon: Contact,
    subtitle: "Informacion del usuario",
  },
  {
    title: "Permisos",
    url: "permissions",
    icon: UsersRound,
    subtitle: "Asignación de permisos",
  },
  {
    title: "Sensores",
    url: "dashboard",
    icon: ChartSpline,
    subtitle: "Monitoreo en tiempo real",
  },
  {
    title: "Reportes",
    url: "reports",
    icon: ClipboardList,
    subtitle: "Historial y análisis",
  },
  {
    title: "Calculadora de productos",
    url: "calculator",
    icon: Calculator,
    subtitle: "Estimación de producción",
  },
  {
    title: "Asistente virtual",
    url: "assistant",
    icon: BotMessageSquare,
    subtitle: "Soporte y ayuda",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-4 border-b-2 pt-4 rounded-b-none mt-2 pb-8">
            <div className="flex items-start gap-2">
              <Image
                src="/logo.png"
                alt="Biogestor"
                width={200}
                height={64}
                priority
              />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-start gap-2 h-10 p-0"
                    >
                      <item.icon className="mt-1" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-tight">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="text-xs text-gray-500 leading-snug">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
