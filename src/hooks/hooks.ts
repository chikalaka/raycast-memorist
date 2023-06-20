import { Item } from "../types/types"
import { useEffect, useState } from "react"
import { LocalStorage } from "@raycast/api"

const REMEMBER_LIST = "rememberList"

export const useRecallList = () => {
  const [items, setItems] = useState<Item[]>([])

  // Get initial list
  useEffect(() => {
    LocalStorage.getItem<string>(REMEMBER_LIST).then((list) => {
      if (list) {
        setItems(JSON.parse(list))
      }
    })
  }, [])

  // Update list when items change
  useEffect(() => {
    LocalStorage.setItem(REMEMBER_LIST, JSON.stringify(items))
  }, [JSON.stringify(items)])

  const remove = (title: string) => {
    const filteredList = items.filter((item) => item.title !== title)
    setItems(filteredList)
  }

  const update = (id: string, item: Item) => {
    const index = items.findIndex((i) => i.title === id)
    const newList = [...items]
    newList[index] = item
    setItems(newList)
  }

  const add = (item: Item): boolean => {
    if (items.map((i) => i.title).includes(item.title)) {
      return false
    }
    const newList = [...items]
    newList.push(item)
    setItems(newList)
    return true
  }

  return { items, remove, add, update }
}
