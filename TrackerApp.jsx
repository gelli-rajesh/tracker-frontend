import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/auth/LoginComponent';
import RegisterComponent from './components/auth/RegisterComponent';
import TaskToastNotification from './components/common/TaskToastNotification';
import ConnectionsComponent from './components/connections/ConnectionsComponent';
import SendConnectionRequestComponent from './components/connections/SendConnectionRequestComponent';
import DashboardComponent from './components/dashboard/DashboardComponent';
import Header from './components/layout/Header';
import TaskDetailComponent from './components/task/TaskDetailComponent';
import SubtaskDetailComponent from './components/task/SubtaskDetailComponent';
import AuthProvider, { useAuth } from './security/AuthContext';
import ProtectedRoute from './security/ProtectedRoute';
import CollabSocketProvider from './websocket/CollabSocketProvider';
import TaskSocketProvider from './websocket/TaskSocketProvider';
import './TrackerApp.css';

function PublicOnlyRoute({ children }) {
    const { isAuthenticated, isBootstrapping } = useAuth();

    if (isBootstrapping) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default function TrackerApp() {
    return (
        <AuthProvider>
            <CollabSocketProvider>
                <TaskSocketProvider>
                    <BrowserRouter>
                        <div className="TrackerApp">
                            <Header />
                            <TaskToastNotification />
                            <main className="tracker-main">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<Navigate to="/login" replace />}
                                    />
                                    <Route
                                        path="/login"
                                        element={
                                            <PublicOnlyRoute>
                                                <LoginComponent />
                                            </PublicOnlyRoute>
                                        }
                                    />
                                    <Route
                                        path="/register"
                                        element={
                                            <PublicOnlyRoute>
                                                <RegisterComponent />
                                            </PublicOnlyRoute>
                                        }
                                    />
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <ProtectedRoute>
                                                <DashboardComponent />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/tasks/:taskId"
                                        element={
                                            <ProtectedRoute>
                                                <TaskDetailComponent />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/tasks/:taskId/subtasks/:subtaskId"
                                        element={
                                            <ProtectedRoute>
                                                <SubtaskDetailComponent />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/connections"
                                        element={
                                            <ProtectedRoute>
                                                <ConnectionsComponent />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/connections/send-request"
                                        element={
                                            <ProtectedRoute>
                                                <SendConnectionRequestComponent />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="*"
                                        element={
                                            <div className="tracker-alert tracker-alert-warning">
                                                Page not found.
                                            </div>
                                        }
                                    />
                                </Routes>
                            </main>
                        </div>
                    </BrowserRouter>
                </TaskSocketProvider>
            </CollabSocketProvider>
        </AuthProvider>
    );
}
