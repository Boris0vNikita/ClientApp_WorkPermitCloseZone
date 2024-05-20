import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Transaction, { transactionAction, transactionLoader } from "../pages/Transaction";
import Categories, { categoriesAction, categoryLoader } from "../pages/Categories";
import Auth from "../pages/Auth";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import ListDosOutfit from "../pages/ListDosWorkPermit";
import CreateDosOutfit from "../pages/CreateDosWorkPermit";
import IssueLicense from "../pages/IssueLicense";
import GenerateDosWorkPermit from "../pages/GenerateDosWorkPermit";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "auth",
                element: <Auth />,
            },
            {
                path: "dosimetric_outfit",

                // action: categoriesAction,
                // loader: categoryLoader,
                element: <Sidebar />,
                children: [
                    {
                        index: true,
                        element: (
                            <ProtectedRoute>
                                <ListDosOutfit />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "transaction",
                        loader: transactionLoader,
                        action: transactionAction,
                        element: (
                            <ProtectedRoute>
                                <Transaction />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "categories",
                        action: categoriesAction,
                        loader: categoryLoader,
                        element: (
                            <ProtectedRoute>
                                <Categories />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "generate",
                        element: (
                            <ProtectedRoute>
                                <GenerateDosWorkPermit />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "issue",
                        element: (
                            <ProtectedRoute>
                                <IssueLicense />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "create",
                        element: (
                            <ProtectedRoute>
                                <CreateDosOutfit />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
        ],
    },
]);

// const router = createBrowserRouter([
//     {
//         path: HOME_ROUTE,
//         element: <Layout />,
//         children: [
//             {
//                 index: true,
//                 element: <Navigate to={REPORTS_ROUTE} />,
//             },
//             {
//                 path: AUTH_ROUTE,
//                 element: (
//                     <AuthRoute>
//                         <AuthPage />
//                     </AuthRoute>
//                 ),
//             },
//             {
//                 path: REPORTS_ROUTE,
//                 element: (
//                     <ProtectedRoute>
//                         <ReportsLayout />
//                     </ProtectedRoute>
//                 ),
//                 children: [
//                     {
//                         index: true,
//                         element: <EmptyReportPage />,
//                     },
//                     {
//                         path: INDIVIDUAL_DOSE_CARD_REPORT_ROUTE,
//                         element: <IndividualDoseCardReportPage />,
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         path: "/test",
//         element: <TestReport />,
//     },
// ]);
