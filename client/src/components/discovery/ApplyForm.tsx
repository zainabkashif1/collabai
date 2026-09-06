import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "../ui/Button";
import { TagInput } from "../ui/TagInput";
import { useProfile } from "../../context/ProfileContext";
import { applicationSchema, type ApplicationFormValues } from "../../validators/application.schema";
import type { Project } from "../../data/mockProjects";

export function ApplyForm({ project, onSubmit }: { project: Project; onSubmit: (v: ApplicationFormValues) => void }) {
  const { profile } = useProfile();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      // Pre-fill with skills you actually have that overlap what the
      // project asks for — small touch, but it's the kind of thing an
      // "AI-powered" platform should be doing by default, not leaving
      // to the user to notice themselves.
      relevantSkills: (profile?.skills ?? [])
        .map((s) => s.name)
        .filter((name) => project.requiredSkills.includes(name)),
      availability: profile?.availability ?? "",
    },
  });

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-4 rounded-xl border border-line bg-white p-5"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink/80">Why are you a fit for this project?</label>
        <textarea
          {...register("message")}
          rows={3}
          className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-signal resize-none"
        />
        {errors.message && <p className="text-xs text-ember">{errors.message.message}</p>}
      </div>

      <Controller
        control={control}
        name="relevantSkills"
        render={({ field }) => (
          <TagInput label="Relevant skills you bring" value={field.value} onChange={field.onChange} />
        )}
      />
      {errors.relevantSkills && <p className="text-xs text-ember -mt-2">{errors.relevantSkills.message}</p>}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink/80">What would you work on?</label>
        <textarea
          {...register("expectedContribution")}
          rows={2}
          className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-signal resize-none"
        />
        {errors.expectedContribution && <p className="text-xs text-ember">{errors.expectedContribution.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink/80">Your availability</label>
        <input
          {...register("availability")}
          className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-signal"
        />
        {errors.availability && <p className="text-xs text-ember">{errors.availability.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Submitting…" : "Submit application"}
      </Button>
    </motion.form>
  );
}
