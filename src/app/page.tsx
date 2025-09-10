"use client";
import { CopyButton } from "@/components/copy-button";
import { SettingsForm } from "@/components/header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useReadLocalStorage } from "usehooks-ts";

const TODAY = new Date();
const CURRENT_MONTH = TODAY.getMonth();
const YEAR = TODAY.getFullYear().toString();

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const MONTH_LABEL = `${MONTHS[CURRENT_MONTH]}`;

interface NFFormData {
  email: string;
  subject: string;
  body: string;
}

export default function Home() {
  const settings = useReadLocalStorage<Partial<SettingsForm>>(
    "minha-nota:settings"
  );

  const form = useForm<NFFormData>({
    defaultValues: {
      email: "",
      subject: "",
      body: "",
    },
  });

  useEffect(() => {
    if (Object.keys(settings || {})) {
      const newSubject = settings?.subject
        ?.replace("{MES}", MONTH_LABEL)
        .replace("{ANO}", YEAR)
        .replace("{EMPRESA}", settings?.company || "<SEU_NOME>");

      const amount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(settings?.amount ?? 0));

      let bodyRaw =
        settings?.body
          ?.replace("{MES}", MONTH_LABEL)
          .replace("{ANO}", YEAR)
          .replace("{SALARIO}", amount) || "";

      settings?.bank_accounts?.forEach((account, index) => {
        const regex = new RegExp(
          `{CONTA_${(index + 1).toString().padStart(2, "0")}}`,
          "mg"
        );

        bodyRaw = bodyRaw?.replace(
          regex,
          `${account.agency}\n${account.number}\n${account.name}`
        );
      });

      settings?.pix?.forEach((pix, index) => {
        const regex = new RegExp(
          `{PIX_${(index + 1).toString().padStart(2, "0")}}`,
          "mg"
        );

        bodyRaw = bodyRaw?.replace(
          regex,
          `${pix.key}\n${pix.bank}\n${pix.owner}`
        );
      });

      // TODO: validate vars before set subject/body value

      form.setValue("email", settings?.email ?? "");
      form.setValue("subject", newSubject ?? "");
      form.setValue("body", bodyRaw ?? "");
    }
  }, [form, settings]);

  // try use effect
  return (
    <div className="font-sans max-w-xl mx-auto pt-10 px-3 sm:px-0">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinatátio</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} />
                    <CopyButton text={field.value} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assunto</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} />
                    <CopyButton text={field.value} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea className="h-80" {...field} />
                    <CopyButton
                      text={field.value}
                      className="top-1 translate-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
