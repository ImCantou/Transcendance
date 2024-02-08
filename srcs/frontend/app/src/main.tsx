import * as ReactDOM from "react-dom/client";
import "./style/tailwind.css";
import "./style/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx";
import SettingsPage from "./pages/SettingsPage/SettingsPage.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import { ProfileLayoutLoader } from "./layouts/ProfileLayout/ProfileLayoutLoader.tsx";
import ProfileLayout from "./layouts/ProfileLayout/ProfileLayout.tsx";
import OTPLoginPopup from "./pages/OTPPopup/OTPLoginPopup.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";
import { authLoader } from "./layouts/AuthLayout/AuthLoader.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GamePage from "./pages/GamePage/GamePage.tsx";
import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage.tsx";
import { NavBarPage } from "./pages/NavBarPage/NavBarPage.tsx";
import ChatPage from "./pages/ChatPage/ChatPage.tsx";
import SocialPage from "./pages/SocialPage/SocialPage.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LoginPage />,
		errorElement: <NotFoundPage />
	},
	{
		path: "/auth",
		element: <AuthPage />,
		loader: authLoader,
		errorElement: <NotFoundPage />
	},
	{
		element: <NavBarPage />,
		children: [
			{
				path: "/home",
				element: <HomePage />
			},
			{
				path: "/settings",
				element: <SettingsPage />
			},
			{
				path: "/test/settingsCSS",
				element: <OTPLoginPopup />
			},
			{
				path: "/play",
				element: <GamePage />
			},
			{
				path: "/leaderboard",
				element: <LeaderboardPage />
			},
			{
				path: "/chat",
				element: <ChatPage />
			},
			{
				path: "/profile/:username?",
				element: <ProfileLayout />,
				loader: ProfileLayoutLoader,
			},
			{
				path: "/social",
				element: <SocialPage />
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<>
		<ToastContainer />
		<RouterProvider router={router}></RouterProvider>
	</>
);
