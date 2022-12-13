'use client'

import { useContext } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarsStaggered, faArrowRotateBack } from '@fortawesome/free-solid-svg-icons'

import { InteractionContext } from "../../context/InteractionContext"

import mainButton from './MainButton.module.scss'
import { usePathname, useRouter } from "next/navigation"

export default function MainButton() {

   const { nav, toggleNav, filterActive, toggleFilter } = useContext(InteractionContext)

   const pathname = usePathname()

   const router = useRouter()

   const clickHandler = () => {
      if (pathname?.startsWith("/event/")) {
         router.push('/events')
      } else if (filterActive) {
         toggleFilter?.()
      } else {
         toggleNav?.()
      }
   }

   return (
      <button
         className={(nav || filterActive || pathname?.startsWith("/event/")) ? `${mainButton.button} ${mainButton.active}` : mainButton.button}
         onClick={clickHandler}
      >
         {(nav || filterActive || pathname?.startsWith("/event/")) ?
            <FontAwesomeIcon icon={faArrowRotateBack} className={mainButton.icon} /> :
            <FontAwesomeIcon icon={faBarsStaggered} className={mainButton.icon} />}
      </button>
   )
}