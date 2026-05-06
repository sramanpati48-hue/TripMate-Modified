'use client'

import * as React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import {
  PanelGroup as ResizablePanelGroup_Primitive,
  Panel as ResizablePanel_Primitive,
  PanelResizeHandle as ResizablePanelResizeHandle_Primitive,
  type PanelGroupProps,
  type PanelProps,
  type PanelResizeHandleProps,
} from 'react-resizable-panels'

import { cn } from '@/lib/utils'

function ResizablePanelGroup({
  className,
  ...props
}: PanelGroupProps) {
  return (
    <ResizablePanelGroup_Primitive
      data-slot="resizable-panel-group"
      className={cn(
        'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
        className,
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  ...props
}: PanelProps) {
  return <ResizablePanel_Primitive data-slot="resizable-panel" {...props} />
}

interface ResizableHandleProps extends PanelResizeHandleProps {
  withHandle?: boolean
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizableHandleProps) {
  return (
    <ResizablePanelResizeHandle_Primitive
      data-slot="resizable-handle"
      className={cn(
        'bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-background">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePanelResizeHandle_Primitive>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
