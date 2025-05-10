import { MovieCastCrew } from "@/types/types";

export default defineEventHandler(async (event) => {
  const { mediaId, mediaType } = getQuery(event);
  const config = useRuntimeConfig();

  if (!mediaId || !mediaType) {
    return { error: "mediaId and mediaType are required" };
  }
  const response = await $fetch<MovieCastCrew>(
    `https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?language=en-US`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
      },
    }
  );

  const castObj: {
    [key: number]: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    };
  } = {};

  for (const actor of response.cast.slice(0, 10)) {
    if (castObj[actor.id]) {
      castObj[actor.id].character += `, ${actor.character}`;
    } else {
      castObj[actor.id] = {
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profile_path: actor.profile_path || "",
      };
    }
  }
  const topCast = Object.values(castObj);

  const importantJobs = [
    "Director",
    "Writer",
    "Screenplay",
    "Executive Producer",
    "Producer",
  ];
  const crewObj: {
    [key: number]: {
      id: number;
      name: string;
      job: string;
      profile_path: string;
    };
  } = {};

  for (const crewMember of response.crew.slice(0, 10)) {
    if (importantJobs.includes(crewMember.job)) {
      if (crewObj[crewMember.id]) {
        crewObj[crewMember.id].job += `, ${crewMember.job}`;
      } else {
        crewObj[crewMember.id] = {
          id: crewMember.id,
          name: crewMember.name,
          job: crewMember.job,
          profile_path: crewMember.profile_path || "",
        };
      }
    }
  }

  const topCrew = Object.values(crewObj);

  return { cast: topCast, crew: topCrew };
});
