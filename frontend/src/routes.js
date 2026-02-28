import { Routes, Route } from "react-router-dom"
import { Main } from "./main"
import { Category } from "./category"
import { Product } from "./product"
import { Register } from "./register"
import { Login } from "./login"
import { Related } from "./reletedproducts"
import { Detail } from "./productdetail"
import { Cart } from "./cart"
import { Wish } from "./wishlist"
import { Brand } from "./brand"
import { Check } from "./checkout"
import { Admin } from "./admin"
import { Dashboard } from "./adminpanel"
import { Order } from "./order"
import { About } from "./aboutus"
import { Contact } from "./contact"


export const Rout = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Main></Main>}></Route>
                <Route path="/category" element={<Category></Category>}></Route>
                <Route path="/product" element={<Product></Product>}></Route>
                <Route path="/register" element={<Register></Register>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                <Route path="/related" element={<Related></Related>} />
                <Route path="/detail" element={<Detail></Detail>} />
                <Route path="/cart" element={<Cart></Cart>} />
                <Route path="/wish" element={<Wish></Wish>} />
                <Route path="/brand" element={<Brand></Brand>} />
                <Route path="/checkout" element={<Check></Check>} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/dashboard" element={<Dashboard></Dashboard>} />
                <Route path="/myorder" element={<Order></Order>} />
                <Route path="/about" element={<About></About>} />
                <Route path="/contact" element={<Contact></Contact>} />
            </Routes>
        </>
    )
}