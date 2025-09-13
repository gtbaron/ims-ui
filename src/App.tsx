import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PartsListPage from "./components/parts/PartsListPage";
import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems} from "flowbite-react";
import {HiShoppingBag} from "react-icons/hi";
import {HiWrench} from "react-icons/hi2";
import {ItemListPage} from "@/components/items/ItemListPage";
import {ItemDetailsPage} from "@/components/items/ItemDetailsPage";

export default function App() {
    return (
        <main className="min-h-screen">
            <Router>
                <div id={'main'}>
                    <div id={'left'}>
                        <Sidebar>
                            <SidebarItems>
                                <SidebarItemGroup>
                                    <SidebarItem href="/items" icon={HiShoppingBag}>
                                        Items
                                    </SidebarItem>
                                    <SidebarItem href="/parts" icon={HiWrench}>
                                        Parts
                                    </SidebarItem>
                                </SidebarItemGroup>
                            </SidebarItems>
                        </Sidebar>
                    </div>
                    <div id={'right'}>
                        <Routes>
                            <Route path="/parts" element={<PartsListPage />} />
                            <Route path="/items" element={<ItemListPage />} />
                            <Route path="/item-details" element={<ItemDetailsPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </main>
    )
}
