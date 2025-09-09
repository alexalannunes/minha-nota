"use client";

import { Button } from "./ui/button";
import { Check, Plus, Settings, Trash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, ComponentProps, useEffect, useState } from "react";

const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

function CurrencyInput({
  className,
  type,
  value = "",
  onChange,
  ...props
}: Omit<ComponentProps<"input">, "onChange"> & {
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
}) {
  const [displayValue, setDisplayValue] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digits = rawValue.replace(/\D/g, "");
    const numericValue = Number(digits) / 100;
    setDisplayValue(moneyFormatter.format(numericValue));

    if (onChange) {
      onChange(numericValue);
    }
  };

  return (
    <Input
      className={cn(className)}
      type={type}
      {...props}
      value={displayValue}
      onChange={handleChange}
      inputMode="numeric"
    />
  );
}

const settingsSchema = z.object({
  email: z.string().nonempty("Obrigatório"),
  company: z.string().nonempty("Obrigatório"),
  subject: z.string().nonempty("Obrigatório"),
  body: z.string().nonempty("Obrigatório"),
  amount: z.number("Obrigatório"),
  bank_accounts: z.array(
    z.object({
      name: z.string().nonempty("Obrigatório"),
      agency: z.string().nonempty("Obrigatório"),
      number: z.string().nonempty("Obrigatório"),
    })
  ),
  pix: z.array(
    z.object({
      key: z.string().nonempty("Obrigatório"),
      owner: z.string().nonempty("Obrigatório"),
      bank: z.string().nonempty("Obrigatório"),
    })
  ),
});

export type SettingsForm = z.infer<typeof settingsSchema>;

export function Header() {
  const [settings, setSettings] = useLocalStorage<Partial<SettingsForm>>(
    "minha-nota:settings",
    {}
  );

  console.log(settings);

  const form = useForm<SettingsForm>({
    defaultValues: {
      email: "",
      company: "",
      subject: "",
      amount: undefined,
      body: "",
      bank_accounts: [],
      pix: [],
    },
    mode: "onChange",
    resolver: zodResolver(settingsSchema),
  });

  const {
    fields: bankAccounts,
    append: newBankAccount,
    remove: removeBankAccount,
  } = useFieldArray({
    control: form.control,
    name: "bank_accounts",
  });

  const {
    fields: pix,
    append: newPix,
    remove: removePix,
  } = useFieldArray({
    control: form.control,
    name: "pix",
  });

  useEffect(() => {
    if (Object.keys(settings || {})) {
      form.setValue("email", settings.email || "");
      form.setValue("company", settings.company || "");
      form.setValue("subject", settings.subject || "");
      form.setValue("amount", settings.amount || 0);
      form.setValue("body", settings.body || "");
      form.setValue("bank_accounts", settings.bank_accounts || []);
      form.setValue("pix", settings.pix || []);
    }
  }, [settings]);

  const submit = (data: SettingsForm) => {
    console.log(data);
    setSettings(data);
    toast("Sucesso!", {
      position: "top-center",
      duration: 900,
      icon: <Check />,
    });
  };

  return (
    <div className="h-14 shadow items-center flex justify-between px-3">
      <h1 className="font-semibold">minha-nota</h1>
      {/* in mobile use drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size={"icon"} variant={"outline"}>
            <Settings />
          </Button>
        </SheetTrigger>
        <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Configurações</SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form
              className="px-4 flex flex-col h-[calc(100%-3.5rem-1rem)] pb-2"
              onSubmit={form.handleSubmit(submit)}
            >
              <div className="flex-1 overflow-y-auto space-y-4 -mr-4 pr-4 pl-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destinatátio</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salário</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          {...field}
                          value={moneyFormatter.format(field.value ?? 0)}
                        />
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
                      <FormLabel>Corpo</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <strong
                          className={cn("font-semibold", {
                            "text-destructive":
                              !!form.formState.errors.bank_accounts?.length,
                          })}
                        >
                          Contas bancárias
                        </strong>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="pl-3 border-r-border border-l-2 space-y-4">
                            {bankAccounts.map((item, index) => (
                              <div
                                key={item.id}
                                className="grid grid-cols-2 gap-3 pr-1 items-start"
                              >
                                <FormField
                                  control={form.control}
                                  name={`bank_accounts.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem className="col-span-2">
                                      <div className="flex items-center justify-between">
                                        <FormLabel>Instituição</FormLabel>
                                        <Button
                                          variant={"ghost"}
                                          className="p-0 size-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                          type="button"
                                          onClick={() =>
                                            removeBankAccount(index)
                                          }
                                          aria-label="Remover Conta Bancária"
                                        >
                                          <Trash className="size-3" />
                                        </Button>
                                      </div>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`bank_accounts.${index}.agency`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Agência</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`bank_accounts.${index}.number`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Agência</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                          <Button
                            className="ml-1"
                            type="button"
                            variant={"secondary"}
                            size={"sm"}
                            onClick={() => {
                              newBankAccount({
                                agency: "",
                                name: "",
                                number: "",
                              });
                            }}
                          >
                            Adicionar
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <strong
                          className={cn("font-semibold", {
                            "text-destructive":
                              !!form.formState.errors.pix?.length,
                          })}
                        >
                          PIX
                        </strong>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="pl-3 border-r-border border-l-2 space-y-4">
                            {pix.map((item, index) => (
                              <div
                                key={item.id}
                                className="grid grid-cols-1 gap-3 pr-1 items-start"
                              >
                                <FormField
                                  control={form.control}
                                  name={`pix.${index}.bank`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="flex items-center justify-between">
                                        <FormLabel>Instituição</FormLabel>
                                        <Button
                                          variant={"ghost"}
                                          className="p-0 size-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                          type="button"
                                          onClick={() => removePix(index)}
                                          aria-label="Remover PIX"
                                        >
                                          <Trash className="size-3" />
                                        </Button>
                                      </div>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`pix.${index}.key`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Chave</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`pix.${index}.owner`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nome</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                          <Button
                            className="ml-1"
                            type="button"
                            variant={"secondary"}
                            size={"sm"}
                            onClick={() => {
                              newPix({
                                key: "",
                                owner: "",
                                bank: "",
                              });
                            }}
                          >
                            Adicionar
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              <div className="h-10 flex items-center">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="ml-auto"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
