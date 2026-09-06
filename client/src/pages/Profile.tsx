import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { AxiosError } from "axios";
import { PageTransition } from "../components/PageTransition";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { AlertBanner } from "../components/ui/AlertBanner";
import { TagInput } from "../components/ui/TagInput";
import { SkillsEditor } from "../components/profile/SkillsEditor";
import { CategoryPicker } from "../components/profile/CategoryPicker";
import { ProfilePicturePicker } from "../components/profile/ProfilePicturePicker";
import { useProfile } from "../context/ProfileContext";
import type { Profile, ProficiencyLevel } from "../data/mockProfile";
import { profileSchema, type ProfileFormValues } from "../validators/profile.schema";

const proficiencyTone: Record<ProficiencyLevel, "neutral" | "signal" | "mint" | "ember"> = {
  Beginner: "neutral",
  Intermediate: "signal",
  Advanced: "mint",
  Expert: "ember",
};

export default function ProfilePage() {
  const { profile, isLoading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="p-8 text-ink/60">Loading profile…</div>
      </PageTransition>
    );
  }

  if (!profile) {
    return (
      <PageTransition>
        <div className="p-8 text-ink/60">Couldn't load your profile. Try refreshing.</div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold">My Profile</h1>
          {!isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <ProfileEditForm
            profile={profile}
            onSave={async (updates) => {
              await updateProfile(updates);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView profile={profile} />
        )}
      </div>
    </PageTransition>
  );
}

function ProfileView({ profile }: { profile: Profile }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center gap-4 mb-5">
          <div className="h-16 w-16 overflow-hidden rounded-full bg-signal/10 grid place-items-center text-lg font-semibold text-signal">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt={`${profile.name}'s profile`} className="h-full w-full object-cover" />
            ) : (
              profile.name.slice(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="font-display font-semibold">Profile picture</h2>
            <p className="text-sm text-ink/60">Shown to teammates across the workspace.</p>
          </div>
        </div>
        <h2 className="font-display font-semibold mb-3">Basics</h2>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
          <Field label="Name" value={profile.name} />
          <Field label="University" value={profile.university} />
          <Field label="Degree" value={profile.degreeProgram} />
          <Field label="Semester" value={profile.semester} />
          <Field label="Location" value={`${profile.city}, ${profile.country}`} />
          <Field label="Preferred role" value={profile.preferredRole} />
          <Field label="Preferred team size" value={String(profile.preferredTeamSize)} />
          <Field label="Availability" value={profile.availability} />
        </dl>
        {profile.bio && <p className="text-sm text-ink/70 mt-3 leading-relaxed">{profile.bio}</p>}
      </Card>

      <Card>
        <h2 className="font-display font-semibold mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge key={skill.name} tone={proficiencyTone[skill.proficiency]}>
              {skill.name} — {skill.proficiency}
            </Badge>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display font-semibold mb-3">Interests & preferred categories</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {profile.interests.map((interest) => (
            <Badge key={interest}>{interest}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.preferredCategories.map((category) => (
            <Badge key={category} tone="signal">
              {category}
            </Badge>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display font-semibold mb-3">Links</h2>
        <div className="flex flex-col gap-1.5 text-sm">
          {profile.githubUrl && <LinkRow label="GitHub" url={profile.githubUrl} />}
          {profile.linkedinUrl && <LinkRow label="LinkedIn" url={profile.linkedinUrl} />}
          {profile.portfolioUrl && <LinkRow label="Portfolio" url={profile.portfolioUrl} />}
          {!profile.githubUrl && !profile.linkedinUrl && !profile.portfolioUrl && (
            <p className="text-ink/60">No links added yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink/60 text-xs">{label}</dt>
      <dd className="text-ink font-medium">{value}</dd>
    </div>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-ink/60 w-20 shrink-0">{label}</span>
      <a href={url} target="_blank" rel="noreferrer" className="text-signal truncate">
        {url}
      </a>
    </div>
  );
}

function ProfileEditForm({
  profile,
  onSave,
  onCancel,
}: {
  profile: Profile;
  onSave: (p: Partial<Profile>) => Promise<void>;
  onCancel: () => void;
}) {
  const [saveError, setSaveError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  async function onSubmit(values: ProfileFormValues) {
    setSaveError(null);
    try {
      await onSave({ ...values, profilePicture });
    } catch (err) {
      setSaveError(
        err instanceof AxiosError && err.response?.data?.error
          ? err.response.data.error
          : "Couldn't save your changes. Please try again."
      );
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {saveError && <AlertBanner message={saveError} />}

      <Card className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <ProfilePicturePicker name={profile.name} value={profilePicture} onChange={setProfilePicture} />
        </div>
        <Input label="Name" error={errors.name?.message} {...register("name")} />
        <Input label="University" error={errors.university?.message} {...register("university")} />
        <Input label="Degree / program" error={errors.degreeProgram?.message} {...register("degreeProgram")} />
        <Input label="Semester" error={errors.semester?.message} {...register("semester")} />
        <Input label="City" error={errors.city?.message} {...register("city")} />
        <Input label="Country" error={errors.country?.message} {...register("country")} />
        <Input label="Preferred role" error={errors.preferredRole?.message} {...register("preferredRole")} />
        <Input
          label="Preferred team size"
          type="number"
          error={errors.preferredTeamSize?.message}
          {...register("preferredTeamSize")}
        />
        <div className="col-span-2">
          <Input label="Availability" error={errors.availability?.message} {...register("availability")} />
        </div>
      </Card>

      <Card>
        <Controller
          control={control}
          name="skills"
          render={() => <SkillsEditor control={control} register={register} />}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <TagInput label="Interests" value={field.value} onChange={field.onChange} placeholder="Add an interest…" />
          )}
        />
        <Controller
          control={control}
          name="preferredCategories"
          render={({ field }) => <CategoryPicker value={field.value} onChange={field.onChange} />}
        />
      </Card>

      <Card className="grid grid-cols-1 gap-4">
        <Input label="GitHub URL" error={errors.githubUrl?.message} {...register("githubUrl")} />
        <Input label="LinkedIn URL" error={errors.linkedinUrl?.message} {...register("linkedinUrl")} />
        <Input label="Portfolio URL" error={errors.portfolioUrl?.message} {...register("portfolioUrl")} />
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </motion.form>
  );
}
