import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowUpRight, Check, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { APPS } from "@/data/apps";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Ingresa tu correo y contraseña");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Bienvenido al ERP Netesa");
      navigate("/");
    }, 800);
  };

  const handleDemo = () => {
    setEmail("lucia.ramirez@netesa.com");
    setPassword("demo1234");
    toast.info("Credenciales demo cargadas");
  };

  const featuredApps = APPS.slice(0, 6);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* LEFT — Form column */}
        <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16">
          {/* Brand */}
          <header className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                <span className="text-sm font-bold">N</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight">Netesa ERP</span>
                <span className="text-[11px] text-muted-foreground">Multi-SaaS Platform</span>
              </div>
            </Link>
            <button
              onClick={() => navigate("/")}
              className="hidden items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Invitado
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </header>

          {/* Form */}
          <main className="flex flex-1 flex-col justify-center py-12">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-8 space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Sistema operativo
                </span>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-[34px]">
                  Inicia sesión
                </h1>
                <p className="text-sm text-muted-foreground">
                  Accede a tu panel de control unificado del ecosistema Netesa.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                    Correo corporativo
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@netesa.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                      Contraseña
                    </Label>
                    <button
                      type="button"
                      className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        toast.info("Contacta a tu administrador para restablecer la contraseña")
                      }
                    >
                      ¿Olvidaste?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(Boolean(v))}
                  />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-xs font-normal text-muted-foreground"
                  >
                    Mantener sesión iniciada en este equipo
                  </Label>
                </div>

                <Button type="submit" disabled={loading} className="h-11 w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Acceder al ERP
                      <span className="ml-1 hidden items-center gap-0.5 rounded border border-primary-foreground/30 px-1 py-0.5 text-[10px] font-medium text-primary-foreground/80 sm:inline-flex">
                        <Command className="h-2.5 w-2.5" />↵
                      </span>
                    </>
                  )}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                      o
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full"
                  onClick={handleDemo}
                >
                  Probar con cuenta demo
                </Button>
              </form>

              <p className="mt-8 text-center text-xs text-muted-foreground">
                ¿Necesitas una cuenta?{" "}
                <Link to="/" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Solicítala a tu administrador
                </Link>
              </p>
            </div>
          </main>

          <footer className="flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Netesa · ERP Multi-SaaS</span>
            <div className="flex items-center gap-4">
              <span>Términos</span>
              <span>Privacidad</span>
              <span>Soporte</span>
            </div>
          </footer>
        </div>

        {/* RIGHT — Visual / ecosystem column */}
        <aside className="relative hidden overflow-hidden border-l border-border bg-muted/30 lg:block">
          {/* Subtle dotted background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--muted-foreground) / 0.18) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden
          />
          {/* Soft accent gradient */}
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, hsl(var(--primary) / 0.18), transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
            {/* Top: pill */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Ecosistema Netesa
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">v2.4 · 2026</span>
            </div>

            {/* Middle: headline + apps mosaic */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-semibold leading-[1.1] tracking-tight xl:text-5xl">
                  Un solo acceso para todo
                  <br />
                  <span className="text-muted-foreground">tu ecosistema SaaS.</span>
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Administra leads, suscripciones, facturación y operaciones de
                  todas tus aplicaciones desde una experiencia unificada.
                </p>
              </div>

              {/* Apps grid mosaic */}
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {featuredApps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <div
                      key={app.id}
                      className="group flex flex-col gap-2 rounded-xl border border-border bg-background/80 p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold tracking-tight">
                          {app.shortName}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {app.category === "core" ? "Core" : "SaaS"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feature checks */}
              <ul className="space-y-2.5 text-sm">
                {[
                  "CRM unificado y leads segmentados por App",
                  "Facturación con OCR y exportación contable",
                  "Auditoría completa y multi-tenant",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-foreground/80">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: testimonial-style card */}
            <figure className="rounded-xl border border-border bg-background/80 p-5 backdrop-blur-sm max-w-md">
              <blockquote className="text-sm leading-relaxed text-foreground/85">
                "Centralizamos toda la operación comercial y financiera de seis
                productos SaaS en una sola plataforma. Reducimos tiempos de
                cierre en un 40%."
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                  LR
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold">Lucía Ramírez</span>
                  <span className="text-[11px] text-muted-foreground">
                    Head of Operations · Netesa
                  </span>
                </div>
              </figcaption>
            </figure>
          </div>
        </aside>
      </div>
    </div>
  );
}
