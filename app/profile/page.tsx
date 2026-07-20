"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Navbar } from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { Footer } from "../../components/layout/Footer";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, LogOut, Camera, Trash2, Save, Lock, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmLogoutModal } from "../../components/auth/ConfirmLogoutModal";
import { usersService } from "../../services/users";

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuthStore();
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletePhotoOpen, setIsDeletePhotoOpen] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPhotoChanged = avatar !== (user?.avatar_url || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isCurrentPasswordCorrect, setIsCurrentPasswordCorrect] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  const getNewReqColor = (isMet: boolean) => {
    if (!newPassword) {
      return {
        text: "text-slate-400 dark:text-slate-500",
        dot: "bg-slate-300 dark:bg-slate-700",
      };
    }
    return isMet
      ? { text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" }
      : { text: "text-rose-500/90 dark:text-rose-400/90", dot: "bg-rose-500" };
  };

  const reqLen = getNewReqColor(newPassword.length >= 8);
  const reqUpper = getNewReqColor(/[A-Z]/.test(newPassword));
  const reqNumber = getNewReqColor(/[0-9]/.test(newPassword));
  const reqSpecial = getNewReqColor(/[^A-Za-z0-9]/.test(newPassword));

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewPasswordError("");
    setConfirmPasswordError("");

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (!newPassword) {
      setNewPasswordError("New password is required");
      return;
    }

    if (currentPassword === newPassword) {
      setNewPasswordError("New password must be different from current password");
      return;
    }

    if (!/^[ -~]*$/.test(newPassword)) {
      setNewPasswordError("Only English characters, numbers and standard symbols are allowed");
      return;
    }

    if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setNewPasswordError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setNewPasswordError("Password must contain at least one number");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setNewPasswordError("Password must contain at least one special character");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      await usersService.changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatar(user.avatar_url || "");
    }
  }, [user]);

  useEffect(() => {
    if (!currentPassword) {
      setIsCurrentPasswordCorrect(false);
      setCurrentPasswordError("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingPassword(true);
      try {
        const isValid = await usersService.verifyPassword(currentPassword);
        setIsCurrentPasswordCorrect(isValid);
        if (!isValid) {
          setCurrentPasswordError("Incorrect current password");
        } else {
          setCurrentPasswordError("");
        }
      } catch (error) {
        setCurrentPasswordError("Failed to verify password");
        setIsCurrentPasswordCorrect(false);
      } finally {
        setIsCheckingPassword(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPassword]);

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch {
      toast.error("Logout failed");
      setIsLoggingOut(false);
      setIsLogoutOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhotoClick = () => {
    setIsDeletePhotoOpen(true);
  };

  const handleConfirmRemovePhoto = async () => {
    setIsDeletingPhoto(true);
    try {
      await updateProfile(user?.username || username, undefined);
      setAvatar("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsDeletePhotoOpen(false);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to remove profile photo");
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  const handleCancelPhotoChange = () => {
    setAvatar(user?.avatar_url || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSavePhoto = async () => {
    setIsSavingPhoto(true);
    try {
      await updateProfile(user?.username || username, avatar || undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to update profile photo");
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (username.trim().length > 30) {
      toast.error("Username cannot exceed 30 characters");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(username.trim(), avatar || undefined);
      setIsEditingUsername(false);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!username) return "U";
    return username.trim().substring(0, 2).toUpperCase();
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                Account Settings
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Manage your public profile identity, picture, and session.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Profile Photo Editor Card */}
              <Card className="border border-slate-200/55 dark:border-slate-800/80 shadow-sm p-6 flex flex-col items-center text-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-6 self-start">
                  Profile Photo
                </h3>
                
                {/* Avatar Preview */}
                <div className="relative group h-28 w-28 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 mb-4 flex items-center justify-center shadow-inner">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt="Avatar Preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                      {getInitials()}
                    </span>
                  )}
                  
                  {/* Photo Change Overlay */}
                  <div 
                    onClick={triggerFileInput}
                    className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Camera className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Change</span>
                  </div>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                />

                <div className="flex flex-col gap-2 w-full mt-2">
                  {isPhotoChanged ? (
                    <>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        className="w-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                        onClick={handleSavePhoto}
                        loading={isSavingPhoto}
                        icon={<Save className="h-3.5 w-3.5" />}
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={handleCancelPhotoChange}
                        disabled={isSavingPhoto}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-semibold"
                        onClick={triggerFileInput}
                      >
                        Upload Photo
                      </Button>
                      
                      {avatar && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          onClick={handleRemovePhotoClick}
                          icon={<Trash2 className="h-3.5 w-3.5" />}
                        >
                          Remove Photo
                        </Button>
                      )}
                    </>
                  )}
                </div>
                
                <p className="text-[10px] text-slate-400 dark:text-slate-655 mt-4 leading-normal">
                  JPG or PNG. Max size 2MB.
                </p>
              </Card>

              {/* Profile Details and Password Forms Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Details Form Card */}
                <Card className="border border-slate-200/55 dark:border-slate-800/80 shadow-sm p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 dark:text-slate-500 mb-6">
                    Personal Details
                  </h3>

                  <form onSubmit={handleSave} className="space-y-5">
                    {/* Username Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Username
                        </label>
                        {!isEditingUsername && (
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            Click button to edit
                          </span>
                        )}
                      </div>
                      <Input
                        id="profile-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                        icon={<UserIcon className="h-4 w-4 text-slate-400" />}
                        disabled={!isEditingUsername}
                        className={`w-full disabled:opacity-65 disabled:bg-slate-50/50 disabled:cursor-not-allowed dark:disabled:bg-slate-900/30 ${
                          isEditingUsername
                            ? "!border-indigo-500 focus:!ring-indigo-500/25 focus:!border-indigo-500 dark:!border-indigo-500"
                            : ""
                        }`}
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setIsEditingUsername(!isEditingUsername)}
                            className={`p-1.5 rounded-md transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-center font-medium ${
                              isEditingUsername
                                ? "bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-700 shadow-sm focus:ring-2 focus:ring-amber-500/30"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md shadow-indigo-600/30 focus:ring-2 focus:ring-indigo-500/40 animate-pulse hover:animate-none"
                            }`}
                            title={isEditingUsername ? "Cancel editing username" : "Click here to edit username"}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        }
                      />
                    </div>

                    {/* Email Read-only Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Email Address
                        </label>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                          <Lock className="h-2.5 w-2.5" /> Read-only
                        </span>
                      </div>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                          <Mail className="h-4 w-4 text-slate-400" />
                        </div>
                        <p
                          id="profile-email"
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 pl-10 text-sm text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-900/30 opacity-65 flex items-center min-h-[38px] truncate"
                        >
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                    {/* Save Profile Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-6">
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 focus:outline-none cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>

                      <Button
                        type="submit"
                        variant="primary"
                        loading={isSaving}
                        disabled={!isEditingUsername || username.trim() === (user?.username || "")}
                        icon={<Save className="h-4.5 w-4.5" />}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Change Password Card */}
                <Card className="border border-slate-200/55 dark:border-slate-800/80 shadow-sm p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-455 dark:text-slate-500 mb-6">
                    Change Password
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-5">
                    {/* Current Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Current Password
                        </label>
                        {!isCurrentPasswordCorrect && (
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            Enter to unlock
                          </span>
                        )}
                      </div>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        icon={
                          <Lock
                            className={`h-4 w-4 transition-colors ${
                              isCurrentPasswordCorrect
                                ? "text-emerald-500"
                                : "text-indigo-600 dark:text-indigo-400"
                            }`}
                          />
                        }
                        error={currentPasswordError}
                        className={`w-full transition-all ${
                          isCurrentPasswordCorrect
                            ? "!border-emerald-500 focus:!ring-emerald-500/25"
                            : "!border-indigo-500/60 dark:!border-indigo-500/60 focus:!ring-indigo-500/25 focus:!border-indigo-600 shadow-xs"
                        }`}
                      />
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        New Password
                      </label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewPassword(val);
                          if (val.trim()) {
                            if (val === currentPassword) {
                              setNewPasswordError("New password must be different from current password");
                            } else {
                              setNewPasswordError("");
                            }
                          }
                        }}
                        placeholder="••••••••"
                        icon={<Lock className="h-4 w-4 text-slate-400" />}
                        error={newPasswordError}
                        disabled={!isCurrentPasswordCorrect}
                        className="w-full disabled:opacity-65 disabled:bg-slate-50/50 disabled:cursor-not-allowed dark:disabled:bg-slate-900/30"
                      />
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Confirm New Password
                      </label>
                      <Input
                        id="confirm-new-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (e.target.value.trim()) setConfirmPasswordError("");
                        }}
                        placeholder="••••••••"
                        icon={<Lock className="h-4 w-4 text-slate-400" />}
                        error={confirmPasswordError}
                        disabled={!isCurrentPasswordCorrect}
                        className="w-full disabled:opacity-65 disabled:bg-slate-50/50 disabled:cursor-not-allowed dark:disabled:bg-slate-900/30"
                      />
                    </div>

                    {/* Password requirements checklist */}
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Password must contain:
                      </span>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-medium">
                        <div className={`flex items-center gap-1.5 transition-colors duration-200 ${reqLen.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${reqLen.dot}`} />
                          Min. 8 characters
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors duration-200 ${reqUpper.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${reqUpper.dot}`} />
                          One uppercase letter
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors duration-200 ${reqNumber.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${reqNumber.dot}`} />
                          One number
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors duration-200 ${reqSpecial.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${reqSpecial.dot}`} />
                          One special char
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-6">
                      <Button
                        type="submit"
                        variant="primary"
                        loading={isChangingPassword}
                        disabled={!isCurrentPasswordCorrect}
                        icon={<Save className="h-4.5 w-4.5" />}
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>

      <ConfirmLogoutModal 
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />

      <ConfirmLogoutModal
        isOpen={isDeletePhotoOpen}
        onClose={() => setIsDeletePhotoOpen(false)}
        onConfirm={handleConfirmRemovePhoto}
        isLoading={isDeletingPhoto}
        title="Remove Profile Photo"
        description="Are you sure you want to remove your profile photo? This action will immediately delete your picture."
        confirmText="Remove Photo"
        icon={<Trash2 className="h-4.5 w-4.5 text-red-500" />}
      />
    </ProtectedRoute>
  );
}
