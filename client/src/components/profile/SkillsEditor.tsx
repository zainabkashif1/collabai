import { useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import type { ProfileFormValues } from "../../validators/profile.schema";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

interface SkillsEditorProps {
  control: Control<ProfileFormValues>;
  register: UseFormRegister<ProfileFormValues>;
}

/**
 * useFieldArray is React Hook Form's tool for a *variable-length* list of
 * fields (add/remove skills) inside one form — plain `register()` only
 * handles fixed fields. `fields` below gives each row a stable `id` to
 * key on, since array index alone breaks once you remove a row from the
 * middle of the list.
 */
export function SkillsEditor({ control, register }: SkillsEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-ink/80">Skills</label>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 items-center"
            >
              <input
                {...register(`skills.${index}.name`)}
                placeholder="e.g. Python"
                className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-signal"
              />
              <select
                {...register(`skills.${index}.proficiency`)}
                className="rounded-lg border border-line bg-white px-2.5 py-2 text-sm outline-none focus:border-signal"
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-ink/60 hover:text-ember px-2"
                aria-label="Remove skill"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => append({ name: "", proficiency: "Beginner" })}
        className="self-start text-sm font-medium text-signal mt-1"
      >
        + Add skill
      </button>
    </div>
  );
}
