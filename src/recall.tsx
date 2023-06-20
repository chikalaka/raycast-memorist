import {
  Action,
  ActionPanel,
  LaunchType,
  List,
  popToRoot,
  showToast,
  useNavigation,
} from "@raycast/api"
import { useRecallList } from "./hooks/hooks"
import { Item } from "./types/types"
import Remember from "./remember"

const formatMarkdown = (item: Item): string => {
  return `${item.title}

  ---
  ${item.content}
`
}

export default function Recall() {
  const { items, remove } = useRecallList()
  const { push } = useNavigation()

  return (
    <List isShowingDetail>
      {items.map((item) => (
        <List.Item
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                content={item.content}
                onCopy={() => popToRoot()}
              />
              <Action
                title={"Remove"}
                onAction={() => {
                  remove(item.title)
                  showToast({ title: `${item.title} Removed` })
                }}
                shortcut={{ key: "x", modifiers: ["ctrl"] }}
              />
              <Action
                title={"Edit"}
                onAction={() => {
                  push(
                    <Remember
                      launchType={LaunchType.UserInitiated}
                      arguments={true}
                      defaultValues={item}
                      isEditMode={true}
                    />
                  )
                }}
                shortcut={{ key: "e", modifiers: ["cmd"] }}
              />
            </ActionPanel>
          }
          key={item.title}
          title={item.title}
          subtitle={item.content}
          detail={<List.Item.Detail markdown={formatMarkdown(item)} />}
        />
      ))}
    </List>
  )
}
