'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useContext, useEffect, useRef, useState } from 'react'

import galleryStyle from './gallery.module.scss'
import styles from '../../(pages)/(event)/events/Events.module.scss'
import { decode } from 'html-entities'
import { FilterContext } from '../../(pages)/(event)/context/FilterContext'

const Gallery = ({ array, zIndex, setZIndex }:
   { array: any[], zIndex: number, setZIndex: React.Dispatch<React.SetStateAction<number>> }) => {

   const galleryRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const container = galleryRef.current?.parentElement?.parentElement?.parentElement
      const maxTargetHeight = galleryRef.current?.parentElement?.scrollHeight!
      const currentTargetHeight = galleryRef.current?.scrollHeight!

      const onScroll = () => {
         const scrollY = container?.scrollTop!
         const yDecimal = scrollY / (maxTargetHeight - window.innerHeight)
         const maxY = currentTargetHeight - maxTargetHeight
         const panY = maxY * yDecimal
         galleryRef.current!.style.transform = `translateY(${-panY}px)`
      }

      container?.addEventListener('scroll', onScroll)
      return () => {
         container?.removeEventListener('scroll', onScroll)
      }
   }, [])

   const { type, date } = useContext(FilterContext)

   useEffect(() => {
      const container = galleryRef.current?.parentElement?.parentElement?.parentElement
      container?.scrollTo({ top: 0 })
   }, [type, date])


   const pathname = usePathname()

   return (
      <div
         className={pathname === '/events' ? `${galleryStyle.gallery} ${styles.gallery}` : `${galleryStyle.gallery} ${galleryStyle.reverse}`}
         ref={galleryRef}
      >
         {pathname === '/contact' ?
            array.map((image, index) =>
               <ImageCard image={image} key={index} />) :
            array.map((event) =>
               <EventCard event={event} key={event._id} zIndex={zIndex} setZIndex={setZIndex} />)
         }
      </div>
   )
}

const EventCard = ({ event, zIndex, setZIndex }:
   { event: any, zIndex: number, setZIndex: React.Dispatch<React.SetStateAction<number>> }) => {

   const { type, date } = useContext(FilterContext)

   return (
      <div
         className={!!type && type !== event.type ?
            `${galleryStyle.card} ${galleryStyle.filtered}`
            : galleryStyle.card}
         key={event._id}
         onClick={e => {
            setZIndex((prevState: number) => prevState + 1)
            console.log(zIndex)
            const card = e.currentTarget.children[0] as HTMLElement
            const clientRect = card.getBoundingClientRect()
            console.log(clientRect, window.innerHeight - clientRect.y - clientRect.height)

            e.currentTarget.style.zIndex = `${zIndex + 1}`

            card.style.inset = `${-clientRect.y}px 
            ${-(window.innerWidth - clientRect.x - clientRect.width)}px 
            ${-(window.innerHeight - clientRect.y - clientRect.height)}px 
            ${-clientRect.x}px`
         }}
      >
         <div
            className={
               galleryStyle.cardContainer}
         >
            <div className={galleryStyle.image}>
               <Image
                  className={galleryStyle.src}
                  src={event.images.cover}
                  fill={true}
                  sizes='100vw'
                  alt={`${decode(event.title)} image`}
               />
            </div>
            <h2 className={galleryStyle.headline}>
               <span className={galleryStyle.title}>{decode(event.title)}</span>
               {!!event.artist && <span className={galleryStyle.artist}>{decode(event.artist.name)}</span>}
            </h2>
            {new Date() < new Date(event.dates.start) &&
               <div className={galleryStyle.marker}>
                  <span className={galleryStyle.text}>??????????</span>
               </div>}
         </div>
      </div>
   )
}
// const EventCard = ({ event }: { event: any }) => {

//    const { type, date } = useContext(FilterContext)

//    return (
//       <Link href={`/event/${event.link}`}
//          className={!!type && type !== event.type ?
//             `${galleryStyle.card} ${galleryStyle.filtered}`
//             : galleryStyle.card}
//          key={event._id}
//       >
//          <Image
//             className={galleryStyle.image}
//             src={event.images.cover}
//             fill={true}
//             sizes='50vw'
//             alt={`${decode(event.title)} image`}
//          />
//          <h2 className={galleryStyle.headline}>
//             <span className={galleryStyle.title}>{decode(event.title)}</span>
//             {!!event.artist && <span className={galleryStyle.artist}>{decode(event.artist.name)}</span>}
//          </h2>
//          {new Date() < new Date(event.dates.start) &&
//             <div className={galleryStyle.marker}>
//                <span className={galleryStyle.text}>??????????</span>
//             </div>}
//       </Link>
//    )
// }



const ImageCard = ({ image }: { image: string }) => {
   return (
      <div className={galleryStyle.card}>
         <Image
            className={galleryStyle.image}
            src={image}
            fill={true}
            sizes='50vw'
            alt='image'
         />
      </div>
   )
}

export default Gallery