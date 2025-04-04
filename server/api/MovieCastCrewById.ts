import { MovieCastCrew } from "@/types/types";

export default defineEventHandler(async (event) => {
  const { movieId } = getQuery(event);
  const config = useRuntimeConfig();

  const response = await $fetch<MovieCastCrew>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
      },
    }
  );

  const topCast = response.cast.slice(0, 5).map((actor: any) => ({
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profile_path: actor.profile_path,
  }));

  const importantJobs = [
    "Director",
    "Writer",
    "Screenplay",
    "Executive Producer",
    "Producer",
  ];
  const filteredCrew = response.crew.filter((crew: any) =>
    importantJobs.includes(crew.job)
  );
  const topCrew = filteredCrew.map((crew: any) => ({
    id: crew.id,
    name: crew.name,
    job: crew.job,
    profile_path: crew.profile_path,
  }));

  return { cast: topCast, crew: topCrew };
});
