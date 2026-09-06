import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { TagInput } from "../components/ui/TagInput";
import { useProjects } from "../context/ProjectsContext";
import { PROJECT_CATEGORIES } from "../data/mockProfile";
import { projectSchema, type ProjectFormValues } from "../validators/project.schema";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

export default function CreateProject() {
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      requiredSkills: [],
      difficulty: "Beginner",
      remote: true,
      durationWeeks: 4,
      teamSize: 3,
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    // Previously sent a client-side guess at ownerName/ownerUniversity
    // with a comment noting "the real backend will derive this from the
    // auth token" — that backend now exists (project.controller.ts
    // ignores whatever the client sends and looks the owner up from
    // req.userId), so this is simpler than it was in FE-6.
    const project = await addProject({ ...values, status: "Open" });
    navigate(`/projects/${project.id}`);
  }

  return (
    <PageTransition>
      <div className="max-w-xl mx-auto px-8 py-10">
        <h1 className="font-display text-2xl font-semibold mb-1">Create a project</h1>
        <p className="text-ink/50 text-sm mb-6">Define what you're building and who you need.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <Input label="Project title" error={errors.title?.message} {...register("title")} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink/80">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-signal resize-none"
                placeholder="What does this project do, and what problem does it solve?"
              />
              {errors.description && <p className="text-xs text-ember">{errors.description.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink/80">Category</label>
              <select
                {...register("category")}
                className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-signal"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a category
                </option>
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-ember">{errors.category.message}</p>}
            </div>
          </Card>

          <Card>
            <Controller
              control={control}
              name="requiredSkills"
              render={({ field }) => (
                <TagInput
                  label="Required skills"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Type a skill and press Enter…"
                />
              )}
            />
            {errors.requiredSkills && <p className="text-xs text-ember mt-1">{errors.requiredSkills.message}</p>}
          </Card>

          <Card className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink/80">Difficulty</label>
              <select
                {...register("difficulty")}
                className="rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-signal"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Team size"
              type="number"
              error={errors.teamSize?.message}
              {...register("teamSize")}
            />
            <Input
              label="Duration (weeks)"
              type="number"
              error={errors.durationWeeks?.message}
              {...register("durationWeeks")}
            />
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 text-sm text-ink/70">
                <input type="checkbox" className="accent-signal" {...register("remote")} />
                Remote-friendly
              </label>
            </div>
          </Card>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing…" : "Publish project"}
          </Button>
        </form>
      </div>
    </PageTransition>
  );
}
