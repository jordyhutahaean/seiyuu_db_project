const ANILIST_API_URL = "https://graphql.anilist.co";

export async function fetchSeiyuuById(staffId: number) {
  const query = `
    query GetSeiyuu($id: Int) {
      Staff(id: $id) {
        id
        age
        name { full native }
        image { large medium }
        dateOfBirth { day month year }
        characters(page: 1, perPage: 12, sort: FAVOURITES_DESC) {
            edges {
                role
                node {
                id
                name { full native }
                image { large }
                }
                media {
                id
                title { romaji english }
                coverImage { large medium }
                }
            }
        }
      }
    }
  `;

  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { id: staffId } }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch seiyuu: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data.Staff;
}