import {
  Action,
  ActionPanel,
  Form,
  LaunchProps,
  popToRoot,
  showToast,
} from "@raycast/api"
import { useState } from "react"
import { isEmpty } from "kickstart-utils"
import { Item } from "./types/types"
import { useRecallList } from "./hooks/hooks"

type RememberProps = {
  isEditMode?: boolean
  defaultValues?: Item
} & LaunchProps<{ draftValues: Item }>

export default function Remember({
  draftValues,
  defaultValues,
  isEditMode,
}: RememberProps) {
  const [titleError, setTitleError] = useState<string | undefined>()
  const [contentError, setContentError] = useState<string | undefined>()
  const { add, update } = useRecallList()

  const initialValues = defaultValues || draftValues

  async function handleSubmit(values: Item) {
    if (isEmpty(values.title)) {
      setTitleError("Required")
      return
    }
    if (isEmpty(values.content)) {
      setContentError("Required")
      return
    }
    if (isEditMode) {
      defaultValues?.title && update(defaultValues.title, values)
    } else {
      const succeed = add(values)
      if (!succeed) {
        setTitleError("Choose a unique title")
        return
      }
    }
    showToast({ title: "I Remember Now ..." })
    popToRoot()
  }

  return (
    <Form
      enableDrafts={!isEditMode}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        title="Title"
        placeholder="Enter title"
        error={titleError}
        onChange={() => setTitleError(undefined)}
        defaultValue={initialValues?.title}
      />
      <Form.TextArea
        id="content"
        title="Content"
        placeholder="Enter content"
        error={contentError}
        onChange={() => {
          setContentError(undefined)
        }}
        defaultValue={initialValues?.content}
      />
    </Form>
  )
}
