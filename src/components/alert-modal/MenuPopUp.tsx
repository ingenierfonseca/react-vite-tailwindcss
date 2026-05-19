/*import { ChevronRightIcon } from "lucide-react";
import { Menubar } from "radix-ui";

export default function MenuPopUp() {
    return (
        <Menubar.Root className="flex rounded-md bg-white p-[3px] shadow-[0_2px_10px] shadow-blackA4">
            <Menubar.Menu>
                <Menubar.Trigger className="flex select-none items-center justify-between gap-0.5 rounded px-3 py-2 text-[13px] font-medium leading-none text-violet11 outline-none data-[highlighted]:bg-violet4 data-[state=open]:bg-violet4">
                    File
                </Menubar.Trigger>
                <Menubar.Portal>
                    <Menubar.Content
                        className="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[transform,opacity] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)]"
                        align="start"
                        sideOffset={5}
                        alignOffset={-3}
                    >
                        <Menubar.Item className="group relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[state=open]:bg-violet4 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
                            New Tab{" "}
                            <div className="ml-auto pl-5 text-mauve9 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                                ⌘ T
                            </div>
                        </Menubar.Item>
                        <Menubar.Item className="group relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[state=open]:bg-violet4 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
                            New Window{" "}
                            <div className="ml-auto pl-5 text-mauve9 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                                ⌘ N
                            </div>
                        </Menubar.Item>
                        <Menubar.Item
                            className="relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[state=open]:bg-violet4 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-violet11"
                            disabled
                        >
                            New Incognito Window
                        </Menubar.Item>
                        <Menubar.Separator className="m-[5px] h-px bg-violet6" />
                        <Menubar.Sub>
                            <Menubar.SubTrigger className="group relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[state=open]:bg-violet4 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
                                Share
                                <div className="ml-auto pl-5 text-mauve9 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                                    <ChevronRightIcon />
                                </div>
                            </Menubar.SubTrigger>
                            <Menubar.Portal>
                                <Menubar.SubContent
                                    className="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[transform,opacity] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)]"
                                    alignOffset={-5}
                                >
                                    <Menubar.Item className="relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[state=open]:bg-violet4 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
                                        Email Link
                                    </Menubar.Item>
                                    <Menubar.Item className="relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[state=open]:bg-violet4 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
                                        Messages
                                    </Menubar.Item>
                                    <Menubar.Item className="relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[state=open]:bg-violet4 data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
                                        Notes
                                    </Menubar.Item>
                                </Menubar.SubContent>
                            </Menubar.Portal>
                        </Menubar.Sub>
                        <Menubar.Separator className="m-[5px] h-px bg-violet6" />
                        <Menubar.Item className="group relative flex h-[25px] select-none items-center rounded px-2.5 text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                            Print…{" "}
                            <div className="ml-auto pl-5 text-mauve9 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                                ⌘ P
                            </div>
                        </Menubar.Item>
                    </Menubar.Content>
                </Menubar.Portal>
            </Menubar.Menu>
        </Menubar.Root>
    )
}*/