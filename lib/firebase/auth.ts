"use client";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import type { User, Role } from "@/types";

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logout() {
  await signOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (!fbUser) return cb(null);
    try {
      const snap = await getDoc(doc(db, "users", fbUser.uid));
      if (snap.exists()) {
        const d = snap.data();
        cb({
          id: fbUser.uid,
          fullName: d.fullName || fbUser.displayName || "Foydalanuvchi",
          role: (d.role as Role) || "student",
          classId: d.classId,
          phone: d.phone,
        });
      } else {
        cb({
          id: fbUser.uid,
          fullName: fbUser.displayName || "Foydalanuvchi",
          role: "student",
        });
      }
    } catch {
      cb({
        id: fbUser.uid,
        fullName: fbUser.displayName || "Foydalanuvchi",
        role: "student",
      });
    }
  });
}