import Image from "next/image"
import { decode } from 'html-entities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCakeCandles, faCalendarDays } from '@fortawesome/free-solid-svg-icons'

import { fetchEvent, fetchNextEvent } from "../../../../../utils/fetch"

import eventStyle from './Event.module.scss'
import Wrapper from "./components/Wrapper"
import Link from "next/link"

export default async function Event({ params }: {
   params: { slug: string }
}) {

   const eventData = fetchEvent(params.slug)
   const nextData = fetchNextEvent(params.slug)

   const [{ data }, nextEvent] = await Promise.all([eventData, nextData])

   return (
      <div className={eventStyle.event}>
         <Wrapper>
            <Hero title={data.title} artist={data.artist?.name} image={data.images.cover} />
            <Info type={data.type} description={data.description.main} dates={data.dates} place={data.place} ageRestriction={data.ageRestriction} image={data.images.info} />
            {!!data.artist?.info && <Artist artist={data.artist} image={data.artist.image} info={data.artist.info} />}
            <ImageThesis image={data.images.thesis.image} thesis={data.images.thesis.text} />
            <AdditionalDesc description={data.description.additional.text} title={data.description.additional.title} />
            {data.images.gallery.length > 1 && <ImageSections gallery={data.images.gallery} />}
            <Next title={nextEvent.title} image={nextEvent.image} link={nextEvent.link} />
         </Wrapper>
      </div>
   )
}

const Hero = ({ title, artist, image }: { title: string, artist: string, image: string }) => (
   <section className={eventStyle.hero}>
      <Image
         className={eventStyle.image}
         src={image}
         fill={true}
         sizes='100vw'
         alt={`${decode(title)} image`}
      />
      <h2 className={eventStyle.headline}>
         <span className={eventStyle.title}>{decode(title)}</span>
         {!!artist && <span className={eventStyle.artistName}>{artist}</span>}
      </h2>
   </section>
)

const Info = ({ type, description, dates, place, ageRestriction, image }:
   { type: string, description: string, dates: { start: Date, end: Date }, place: { floor: number, wing: string }, ageRestriction: number, image: string }) => {

   const wingToRus = (wing: string) => {
      switch (wing) {
         case 'exhibition':
            return '?????????????????????? ??????????'
         case 'museum':
            return '???????????????? ??????????'
         case 'stage':
            return '??????????'
         default:
            return '?????????????????????? ??????????'
      }
   }

   const typeToRus = (type: string) => {
      switch (type) {
         case 'stage':
            return '?????????????????????? ????&nbsp;??????????'
         default:
            return '?????????????????? ????????????????'
      }
   }

   return (
      <section>
         <div className={eventStyle.info}>
            <article>
               <h2 className={eventStyle.type}>{decode(typeToRus(type))}</h2>
               <p className={eventStyle.description}>
                  {decode(description)}
               </p>
            </article>
            <div className={eventStyle.stats}>
               <div className={eventStyle.stat}>
                  <FontAwesomeIcon icon={faCalendarDays} className={eventStyle.icon} />
                  {new Date(dates.start).toLocaleDateString()}{!!dates.end && ` - ${new Date(dates.end).toLocaleDateString()}`}
               </div>
               <ul className={eventStyle.statsList}>
                  <li className={eventStyle.stat}>
                     <FontAwesomeIcon icon={faLocationDot} className={eventStyle.icon} />
                     {`${wingToRus(!!place.wing ? place.wing : type)}, ${place.floor} ????????`}
                  </li>
                  <li className={eventStyle.stat}>
                     <FontAwesomeIcon icon={faCakeCandles} className={eventStyle.icon} />
                     {ageRestriction}+
                  </li>
               </ul>
            </div>
         </div>
         <div className={eventStyle.image}>
            <Image
               className={eventStyle.src}
               src={image}
               fill={true}
               sizes='auto'
               alt='description image'
            />
         </div>
      </section>
   )
}

const Artist = ({ artist, image, info }: { artist: string, image: string, info: string }) => (
   <section>
      <div className={eventStyle.artist}>
         {!!image && <div className={eventStyle.image}>
            <Image
               className={eventStyle.src}
               src={image}
               fill={true}
               sizes='auto'
               alt={`${artist}`}
            />
         </div>}
         <div className={eventStyle.artistInfo}>
            <h2>???? ????????????</h2>
            <p>{decode(info)}</p>
         </div>
      </div>
   </section>
)

const ImageThesis = ({ image, thesis }: { image: string, thesis: string }) => (
   <section className={eventStyle.imageThesis}>
      <div className={eventStyle.image}>
         <Image
            className={eventStyle.src}
            src={image}
            fill={true}
            sizes='100vw'
            alt='thesis image'
         />
      </div>
      <p className={eventStyle.thesis}>{decode(thesis)}</p>
   </section>
)

const AdditionalDesc = ({ description, title }: { description: string, title: string }) => (
   <section className={eventStyle.additionalDesc}>
      <div className={eventStyle.additionalDescWrapper}>
         {!!title && <h2>{decode(title)}</h2>}
         <p>{decode(description)}</p>
      </div>
   </section>
)

const ImageSections = ({ gallery }: { gallery: string[] }) => {

   const imageSections = gallery.reduce(function (rows: any[], key: string, index: number) {
      return (index % 3 == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows
   }, [])

   return (
      <>
         {imageSections.map((section, index: number) => section.length > 1 && (
            <section key={index}>
               {section.map((image: string, index: number) => (
                  <div className={eventStyle.image} key={index}>
                     <Image
                        className={eventStyle.src}
                        src={image}
                        fill={true}
                        sizes='50vw'
                        alt='thesis image'
                     />
                  </div>
               ))}
            </section>
         ))}
      </>
   )
}

const Next = ({ title, image, link }: { title: string, image: string, link: string }) => (
   <section className={eventStyle.next}>
      <Image
         className={eventStyle.image}
         src={image}
         fill={true}
         sizes='100vw'
         alt={`${decode(title)} image`}
      />
      <div className={eventStyle.nextEvent}>
         <span className={eventStyle.nextTitle}>{decode(title)}</span>
         <Link href={`/event/${link}`} className={eventStyle.nextLink}>??????????????</Link>
      </div>
   </section>
)