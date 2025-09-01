import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PartsListPage from "./components/parts/PartsListPage";
import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems} from "flowbite-react";
import {HiShoppingBag} from "react-icons/hi";
import {HiWrench} from "react-icons/hi2";
import {ItemListPage} from "@/components/items/ItemListPage";

export default function App() {
    return (
        <main className="min-h-screen">
            <Router>
                <div id={'main'}>
                    <div id={'left'}>
                        <Sidebar aria-label="Default sidebar example">
                            <SidebarItems>
                                <SidebarItemGroup>
                                    <SidebarItem href="/items" icon={HiShoppingBag}>
                                        Items List
                                    </SidebarItem>
                                    <SidebarItem href="/parts" icon={HiWrench}>
                                        Parts List
                                    </SidebarItem>
                                    {/*<SidebarItem href="#" icon={HiViewBoards} label="Pro" labelColor="dark">*/}
                                    {/*    Kanban*/}
                                    {/*</SidebarItem>*/}
                                    {/*<SidebarItem href="#" icon={HiInbox} label="3">*/}
                                    {/*    Inbox*/}
                                    {/*</SidebarItem>*/}
                                    {/*<SidebarItem href="#" icon={HiUser}>*/}
                                    {/*    Users*/}
                                    {/*</SidebarItem>*/}
                                    {/*<SidebarItem href="#" icon={HiArrowSmRight}>*/}
                                    {/*    Sign In*/}
                                    {/*</SidebarItem>*/}
                                    {/*<SidebarItem href="#" icon={HiTable}>*/}
                                    {/*    Sign Up*/}
                                    {/*</SidebarItem>*/}
                                </SidebarItemGroup>
                            </SidebarItems>
                        </Sidebar>
                    </div>
                    <div id={'right'}>
                        <Routes>
                            <Route path="/parts" element={<PartsListPage />} />
                            <Route path="/items" element={<ItemListPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </main>
    )
}
