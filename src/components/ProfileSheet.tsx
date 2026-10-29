import { useEffect, useState } from "react";
import { User, Check } from "lucide-react";
import { toast } from "sonner";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { FormField } from "@/components/FormField";
import { isValidPhone, loadProfile, saveProfile } from "@/lib/checkout";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Errors = { name?: string; phone?: string; email?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileSheet({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    const profile = loadProfile();
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone);
      setEmail(profile.email);
    }
  }, [open]);

  const handleSubmit = () => {
    const found: Errors = {};
    if (name.trim().length < 2) found.name = "Informe seu nome";
    if (!isValidPhone(phone)) found.phone = "Telefone com DDD, ex.: (21) 99999-9999";
    if (email.trim() && !EMAIL_RE.test(email.trim())) found.email = "E-mail inválido";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      saveProfile({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    } catch (err) {
      console.error("[ProfileSheet] falha ao salvar cadastro", err);
      toast.error("Não foi possível salvar neste navegador. Verifique se não está em aba anônima.");
      return;
    }
    toast.success("Cadastro salvo! Seus dados já vêm preenchidos no checkout.");
    onOpenChange(false);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Seu cadastro"
      description="Salve seus dados para agilizar os próximos pedidos"
      footer={
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full min-h-[56px] rounded-full bg-plum-900 text-cream-50 font-semibold text-base flex items-center justify-center gap-2.5 hover:bg-plum-700 active:bg-plum-950 transition-colors shadow-warm"
        >
          <Check className="h-5 w-5" />
          Salvar cadastro
        </button>
      }
    >
      <div className="px-5 pt-5 pb-6">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-cream-100 grid place-items-center mb-4">
            <User className="h-7 w-7 text-ink-soft" />
          </div>
          <h2 className="text-[20px] text-ink">Seu cadastro</h2>
          <p className="mt-2 text-ink-soft text-sm max-w-[280px]">
            Salve seus dados uma vez e finalize os próximos pedidos mais rápido.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <FormField
            label="Nome"
            value={name}
            onChange={setName}
            error={errors.name}
            autoComplete="name"
            placeholder="Seu nome completo"
          />
          <FormField
            label="Telefone / WhatsApp"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={setPhone}
            error={errors.phone}
            autoComplete="tel-national"
            placeholder="(21) 99999-9999"
          />
          <FormField
            label="E-mail (opcional)"
            type="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            autoComplete="email"
            placeholder="voce@email.com"
          />
        </div>
        <p className="mt-4 text-[12px] text-ink-soft text-center">
          Por enquanto seus dados ficam salvos só neste aparelho.
        </p>
      </div>
    </BottomSheet>
  );
}
