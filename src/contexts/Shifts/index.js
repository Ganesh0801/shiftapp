import React, { createContext } from "react"
import { View } from "react-native"
import { useShifts, useBookShift, useCancelShift } from "hooks/useShiftsApi"
import { formatTime, isOverlapping } from "utils/datetime"
export const ShiftsApiContext = createContext({})

export const ShiftsApiProvider = ({ children }) => {
  const { data, error } = useShifts()
  if (data) {
    const bookedShifts = Object.keys(data).filter((id) => data[id].booked === true)
    const bookedList = {}
    const overlappingList = [] 
    const availableShiftsList = {} 

    
    const areas = [...new Set(Object.keys(data).map((id) => data[id].area))]
    const possibleDates = [...new Set(Object.keys(data).map((id) => formatTime(data[id].startTime)))] 

    areas.map((area) => {
      availableShiftsList[area] = {}
      possibleDates.map((date) => {
        availableShiftsList[area][date] = [] 
      })
    })

    possibleDates.map((date) => {
      bookedList[date] = [] 
    })

    Object.keys(data).map((id) => {
      const shift = data[id]

      
      if (Date.now() < shift.startTime)
        availableShiftsList[shift.area][formatTime(shift.startTime)] = [
          ...availableShiftsList[shift.area][formatTime(shift.startTime)],
          id,
        ]

      bookedShifts.map((bid) => {
       
        if (bid === id) bookedList[formatTime(shift.startTime)] = [...bookedList[formatTime(shift.startTime)], bid]
       
        const timestamp1 = {
          startTime: shift.startTime,
          endTime: shift.endTime,
        }
        const timestamp2 = {
          startTime: data[bid].startTime,
          endTime: data[bid].endTime,
        }
        if (isOverlapping(timestamp1, timestamp2) && !overlappingList.includes(id) && !bookedShifts.includes(id))
          overlappingList.push(id)
      })
    })
    return (
      <ShiftsApiContext.Provider
        value={{ data, areas, bookedList, overlappingList, availableShiftsList, error, useBookShift, useCancelShift }}
      >
        {children}
      </ShiftsApiContext.Provider>
    )
  }

  return <View />
}
