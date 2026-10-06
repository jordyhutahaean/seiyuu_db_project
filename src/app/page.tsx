import Image from "next/image";
import styles from "./page.module.css";
import { fetchSeiyuuById } from "@/lib/anilist";
import { title } from "process";

const seiyuuId = 119438; // Replace with the desired seiyuu ID

type DOB = { year: number | null; month: number | null; day: number | null };

function formatDOB(dob?: DOB) {
  if (!dob || (!dob.year && !dob.month && !dob.day)) return "Unknown";
  const date = new Date(dob.year ?? 2000, (dob.month ?? 1) - 1, dob.day ?? 1);
  return date.toLocaleDateString("en-US", {
    ...(dob.year && { year: "numeric" }),
    ...(dob.month && { month: "long" }),
    ...(dob.day && { day: "numeric" }),
  });
}

export default async function Home() {

  let seiyuu;
    try {
      seiyuu = await fetchSeiyuuById(seiyuuId);
    } catch (error) {
      console.error("Error fetching seiyuu:", error);
      return  <p>Error fetching seiyuu information.</p>
    } 
    if (!seiyuu) {
      return <p>Seiyuu not found.</p>;
    }

  const imageUrl = seiyuu.image?.large || seiyuu.image?.medium;

  return (
    <div className={styles.page}>
    <section className={styles.banner}></section>
      <main className={styles.main}>
        <section className={styles.seiyuuPage}>
          <div className={styles.seiyuuInfo}>
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={seiyuu.name.full}
                width={100 * 2}
                height={150 * 2}
              />
            )}
            <div className={styles.seiyuuDetails}>
              <h1>{seiyuu.name.full}</h1>
              <p>{seiyuu.name.native}</p>
              <p>Born: {formatDOB(seiyuu.dateOfBirth)}</p>
            </div>
          </div>
        </section>
        <section className={styles.roleList}>
          <div className={styles.box1}>
            <h1>HHH</h1>
          </div>
          <div className={styles.roles}>
          <h2>Popular Roles</h2>
            {seiyuu.characters?.edges?.map((edge: any) => {
              const character = edge.node;
              const anime = edge.media?.[0];

              const animeTitle = anime?.title.english ?? anime?.title.romaji;
              const animeImg = anime?.coverImage?.large || anime?.coverImage?.medium;
              const charName = character.name.full || character.name.native;
              const charImg = character.image?.large;

              return (
                <div key={character.id} className={styles.roleCard}>
                  <div className={styles.animeChar}>
                  {charImg && (
                    <Image src={charImg} alt={charName} 
                    width={100/2} height={150/2} />
                  )}
                    <div className={styles.verticalName}>
                      <p className={styles.charName}>{charName}</p>
                      <p className={styles.charRole}>{edge.role}</p>
                    </div>
                  </div>

                  {anime && (
                    <div className={styles.animeInfo}>
                      <p>{animeTitle}</p>
                      {animeImg && (
                        <Image src={animeImg} alt={animeTitle} width={100/2} height={150/2} />
                      )}
                    </div>
                   )}                   
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}