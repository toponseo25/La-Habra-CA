"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Phone,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { BUSINESS } from "@/lib/business";
import { captureAttribution, trackLead } from "@/lib/analytics";

const SERVICE_OPTIONS = [
  "AC Repair",
  "AC Installation & Replacement",
  "Heating & Furnace Repair",
  "HVAC Installation",
  "HVAC Maintenance",
  "Mini-Split Systems",
  "Indoor Air Quality",
  "Emergency HVAC Service",
  "Not Sure / General Inquiry",
] as const;

const APPOINTMENT_OPTIONS = [
  "As soon as possible",
  "Today (emergency)",
  "This week",
  "Next week",
  "Specific date — I'll note below",
] as const;

const schema = z.object({
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .max(40)
    .regex(/^[0-9()+\-\s.]+$/, "Phone contains invalid characters"),
  email: z.string().email("Enter a valid email").max(160),
  zipCode: z
    .string()
    .min(5, "ZIP code is required")
    .max(10)
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, "Enter a valid ZIP"),
  serviceNeeded: z.string().min(1, "Please choose a service"),
  appointmentTime: z.string().optional(),
  message: z.string().max(2000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please consent to be contacted" }),
  }),
});

type FormValues = z.infer<typeof schema>;

export function LeadForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      zipCode: "",
      serviceNeeded: "",
      appointmentTime: "",
      message: "",
      consent: false as unknown as true,
    },
  });

  const consent = watch("consent");

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const attribution = captureAttribution();

      const payload = {
        ...values,
        consent: true,
        source: attribution.utm_source ?? "direct",
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
        utm_term: attribution.utm_term,
        utm_content: attribution.utm_content,
        referrer: attribution.referrer,
        landingPage: attribution.landing_page,
        gclid: attribution.gclid,
        fbclid: attribution.fbclid,
        gbpReferral: attribution.gbp,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        const msg =
          data?.issues?.[0]?.message ||
          data?.error ||
          "Something went wrong. Please call us instead.";
        throw new Error(msg);
      }

      trackLead(values.serviceNeeded, "form");
      setSuccess(true);
      reset();
      toast({
        title: "Request received!",
        description:
          "A RAS Heating & Air specialist will reach out to you shortly.",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Submission failed";
      setServerError(msg);
      toast({
        title: "Could not submit",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // --- Success state ---
  if (success) {
    return (
      <div
        id="lead-form"
        className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 p-8 sm:p-10"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" aria-hidden />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Thank you — your request is in!
          </h3>
          <p className="mt-3 text-slate-600 max-w-md">
            A RAS Heating & Air specialist will call you back shortly to confirm
            your appointment details. Keep your phone handy.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Need service right now? Call us directly:
          </p>
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-6 py-3 text-white font-bold shadow-lg shadow-orange-500/30 transition"
            onClick={() => {}}
          >
            <Phone className="h-5 w-5" aria-hidden />
            {BUSINESS.phoneDisplay}
          </a>
          <button
            type="button"
            className="mt-6 text-sm text-slate-500 underline underline-offset-4 hover:text-slate-700"
            onClick={() => setSuccess(false)}
          >
            Submit another request
          </button>
        </motion.div>
      </div>
    );
  }

  // --- Form state ---
  return (
    <div
      id="lead-form"
      className="relative scroll-mt-24"
      aria-labelledby="lead-form-heading"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header strip */}
        <div className="bg-slate-900 px-6 sm:px-8 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
            <h2
              id="lead-form-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight"
            >
              Get Your FREE HVAC Estimate
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Fast response for La Habra homeowners. No obligation.{" "}
            <span aria-hidden>*</span>Same-day service available.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 sm:p-8 space-y-5"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" required error={errors.firstName?.message}>
              <Input
                autoComplete="given-name"
                placeholder="Jane"
                aria-invalid={!!errors.firstName}
                {...register("firstName")}
              />
            </Field>
            <Field label="Last Name" required error={errors.lastName?.message}>
              <Input
                autoComplete="family-name"
                placeholder="Doe"
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone" required error={errors.phone?.message}>
              <Input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(562) 555-0147"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </Field>
            <Field label="Email" required error={errors.email?.message}>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="ZIP Code" required error={errors.zipCode?.message}>
              <Input
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="90631"
                maxLength={10}
                aria-invalid={!!errors.zipCode}
                {...register("zipCode")}
              />
            </Field>
            <Field
              label="Service Needed"
              required
              error={errors.serviceNeeded?.message}
            >
              <Select
                onValueChange={(v) => setValue("serviceNeeded", v)}
                value={watch("serviceNeeded")}
              >
                <SelectTrigger aria-label="Service needed">
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field
            label="Preferred Appointment Time"
            error={undefined}
            optional
          >
            <Select
              onValueChange={(v) => setValue("appointmentTime", v)}
              value={watch("appointmentTime")}
            >
              <SelectTrigger aria-label="Preferred appointment time">
                <SelectValue placeholder="When works for you?" />
              </SelectTrigger>
              <SelectContent>
                {APPOINTMENT_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Additional Details"
            error={errors.message?.message}
            optional
          >
            <Textarea
              rows={3}
              placeholder="Tell us what's happening with your system — symptoms, brand, age, anything that helps us prepare."
              {...register("message")}
            />
          </Field>

          {/* Consent */}
          <label
            htmlFor="consent"
            className="flex items-start gap-3 cursor-pointer group"
          >
            <Checkbox
              id="consent"
              checked={!!consent}
              onCheckedChange={(v) =>
                setValue("consent", (v === true) as true, {
                  shouldValidate: true,
                })
              }
              className="mt-0.5 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              I authorize RAS Heating &amp; Air to contact me about my request
              via phone, email, and SMS. Standard messaging rates may apply. We
              never share your information.
            </span>
          </label>
          {errors.consent?.message && (
            <p className="text-sm text-red-600 -mt-2 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" aria-hidden />
              {errors.consent.message}
            </p>
          )}

          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg bg-red-50 ring-1 ring-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden />
                <span>
                  {serverError}{" "}
                  <a
                    href={`tel:${BUSINESS.phoneTel}`}
                    className="font-semibold underline underline-offset-2"
                  >
                    Call {BUSINESS.phoneDisplay}
                  </a>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-6 rounded-full shadow-lg shadow-orange-500/30 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label="Request my free estimate"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Sending your request…
              </>
            ) : (
              <>
                REQUEST MY FREE ESTIMATE
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
            <span>
              Fast, secure &amp; no obligation. Licensed &amp; insured. La Habra,
              CA.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --------------------------- field helper --------------------------- */

function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={undefined} className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-orange-600 ml-0.5">*</span>}
        {optional && (
          <span className="ml-1 text-xs font-normal text-slate-400">
            (optional)
          </span>
        )}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}
