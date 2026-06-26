/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ElementType, FormEvent, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Settings, 
  Bell, 
  Search,
  Menu,
  TrendingUp,
  TrendingDown,
  Clock,
  MessageSquare,
  Wifi,
  Plus,
  Trash2,
  UserPlus,
  BookOpen,
  Printer,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  Lock,
  LogOut,
  ShieldCheck,
  Zap,
  CheckSquare,
  Calendar,
  FileText,
  FileUp,
  Sparkles,
  Loader2,
  ChevronRight,
  Smartphone,
  Send,
  MessageCircle,
  LogIn,
  Upload,
  Copy,
  ExternalLink,
  X,
  Filter,
  Inbox,
  CheckCircle,
  CheckCircle2,
  Download,
  Award,
  WifiOff,
  XCircle,
  BadgeCheck,
  Fingerprint,
  FolderLock,
  Archive,
  Package,
  AlertTriangle,
  Handshake,
  MousePointer2,
  Minus,
  Gift,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType, 
  testFirestoreConnection,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  deleteDoc,
  writeBatch,
  getDocFromServer,
  addDoc,
  updateDoc,
  orderBy,
  collectionGroup,
  arrayUnion,
  arrayRemove,
  increment
} from './firebase';
// Replace the firebase/firestore imports block (already handled by ./firebase import)
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
// End of firebase/auth imports

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface SubscriptionRequest {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolEmail: string;
  schoolPhone?: string;
  plan: SubscriptionPlan;
  method: 'orange' | 'moov' | 'wave';
  proofUrl?: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  date: string;
}

// Bulletin Style Components
const SplashScreen = ({ logo, onComplete }: { logo: string; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)"
      }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Soft warm gradients on white background for "Clean" look */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-100/50 rounded-full blur-[120px]" />
      </div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.05, 1],
          opacity: [0, 1, 1],
        }}
        transition={{ 
          duration: 2.5,
          times: [0, 0.6, 1],
          ease: "easeOut"
        }}
        className="relative"
      >
        <div className="relative group">
          {/* Subtle warm glow */}
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-20 bg-orange-500/10 blur-[80px]" 
          />
          
          {/* Logo Container with mixed orange/amber shadow */}
          <div className="w-48 h-48 bg-white rounded-[3rem] flex items-center justify-center p-10 shadow-[0_32px_64px_-16px_rgba(249,115,22,0.15)] relative z-10 overflow-hidden border border-orange-50">
            {logo && logo.length > 50 ? (
              <img 
                src={logo} 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <GraduationCap className="w-24 h-24 text-orange-500" />
                <span className="font-black text-orange-950/20 text-2xl tracking-tighter">SchoolCore</span>
              </div>
            )}
            
            {/* Glossy effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
        className="mt-16 flex flex-col items-center relative z-20"
      >
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          School<span className="text-orange-500">Core</span>
        </h1>
        <div className="mt-8 flex flex-col items-center gap-4">
           <div className="h-1.5 w-64 bg-slate-100 rounded-full overflow-hidden relative border border-slate-50 shadow-inner">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 3.5, ease: "easeInOut", delay: 0.2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent w-full h-full"
              />
           </div>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.6em] ml-[0.6em] animate-pulse">
             Excellence <span className="text-orange-500">Malienne</span>
           </p>
        </div>
      </motion.div>

      {/* Very subtle grain for premium feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.div>
  );
};

const ClassicBulletin = ({ data, schoolInfo }: { data: any, schoolInfo: any }) => (
  <div className="font-serif text-slate-900">
    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
      <div className="text-center w-1/3">
        <p className="font-bold text-xs uppercase">République du Mali</p>
        <p className="text-[10px]">Un Peuple - Un But - Une Foi</p>
        <div className="w-12 h-0.5 bg-slate-900 mx-auto my-1" />
        <p className="font-bold text-xs uppercase">{schoolInfo.name}</p>
        <p className="text-[10px]">{schoolInfo.address}</p>
      </div>
      <div className="w-24 h-24 border border-slate-200 rounded flex items-center justify-center overflow-hidden">
        {schoolInfo.logo ? (
          <img src={schoolInfo.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        ) : (
          <GraduationCap className="w-12 h-12 text-slate-300" />
        )}
      </div>
      <div className="text-right w-1/3">
        <p className="font-bold text-xs">Année Scolaire en cours</p>
        <p className="text-xs">{data.term}</p>
      </div>
    </div>

    <h2 className="text-center font-black text-2xl uppercase tracking-widest mb-6 underline decoration-double">Bulletin de Notes</h2>

    <div className="grid grid-cols-2 gap-4 mb-6 border p-4 rounded bg-slate-50/50">
      <div>
        <p className="text-sm"><span className="font-bold">Nom & Prénom:</span> {data.student.name}</p>
        <p className="text-sm"><span className="font-bold">Classe:</span> {data.student.class}</p>
      </div>
      <div className="text-right">
        <p className="text-sm"><span className="font-bold">Date:</span> {data.date}</p>
        <p className="text-sm"><span className="font-bold">Effectif:</span> {data.totalStudents}</p>
      </div>
    </div>

    <table className="w-full border-collapse border-2 border-slate-900 mb-6">
      <thead>
        <tr className="bg-slate-100">
          <th className="border-2 border-slate-900 p-2 text-xs uppercase">Matières</th>
          <th className="border-2 border-slate-900 p-2 text-xs uppercase">Coef</th>
          <th className="border-2 border-slate-900 p-2 text-xs uppercase">Moyenne /20</th>
          <th className="border-2 border-slate-900 p-2 text-xs uppercase">Moy. Coef</th>
          <th className="border-2 border-slate-900 p-2 text-xs uppercase">Appréciations</th>
        </tr>
      </thead>
      <tbody>
        {data.subjectAverages.map((s: any, i: number) => (
          <tr key={i}>
            <td className="border-2 border-slate-900 p-2 text-sm font-bold">{s.name}</td>
            <td className="border-2 border-slate-900 p-2 text-center text-sm">{s.coef}</td>
            <td className="border-2 border-slate-900 p-2 text-center text-sm font-bold">{s.average.toFixed(2)}</td>
            <td className="border-2 border-slate-900 p-2 text-center text-sm">{(s.average * s.coef).toFixed(2)}</td>
            <td className="border-2 border-slate-900 p-2 text-xs italic">
              {s.average >= 16 ? 'Excellent' : s.average >= 14 ? 'Très Bien' : s.average >= 12 ? 'Bien' : s.average >= 10 ? 'Passable' : 'Insuffisant'}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="bg-slate-50 font-bold">
          <td colSpan={2} className="border-2 border-slate-900 p-2 text-right uppercase">Totaux</td>
          <td className="border-2 border-slate-900 p-2 text-center">{(data.overallAverage).toFixed(2)}</td>
          <td className="border-2 border-slate-900 p-2 text-center">{(data.overallAverage * data.subjectAverages.reduce((acc: any, s: any) => acc + s.coef, 0)).toFixed(2)}</td>
          <td className="border-2 border-slate-900 p-2" />
        </tr>
      </tfoot>
    </table>

    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="border-2 border-slate-900 p-4 rounded text-center">
        <p className="text-xs font-bold uppercase mb-1">Moyenne Générale</p>
        <p className="text-2xl font-black">{data.overallAverage.toFixed(2)}</p>
      </div>
      <div className="border-2 border-slate-900 p-4 rounded text-center">
        <p className="text-xs font-bold uppercase mb-1">Rang</p>
        <p className="text-2xl font-black">{data.rank}<sup>{data.rank === 1 ? 'er' : 'ème'}</sup></p>
      </div>
      <div className="border-2 border-slate-900 p-4 rounded text-center">
        <p className="text-xs font-bold uppercase mb-1">Décision</p>
        <p className={`text-lg font-black ${data.decision === 'Admis' ? 'text-emerald-600' : 'text-rose-600'}`}>{data.decision}</p>
      </div>
    </div>

    <div className="border-2 border-slate-900 p-4 rounded mb-8">
      <p className="text-xs font-bold uppercase mb-2 flex items-center gap-2">
        <TrendingUp className="w-3 h-3 text-slate-400" />
        Appréciation du Conseil
      </p>
      <p className="text-sm italic leading-relaxed">"{data.aiComment}"</p>
    </div>

    <div className="flex justify-between items-start mt-12">
      <div className="text-center">
        <p className="text-xs font-bold underline mb-12">Le Parent d'Élève</p>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold underline mb-12">Le Titulaire</p>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold underline mb-12">Le Directeur</p>
        <p className="text-[10px] italic mt-8">{schoolInfo.director}</p>
      </div>
    </div>
  </div>
);

const ModernBulletin = ({ data, schoolInfo }: { data: any, schoolInfo: any }) => (
  <div className="font-sans text-slate-900">
    <div className="flex justify-between items-center mb-10">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 overflow-hidden">
          {schoolInfo.logo ? (
            <img 
              src={schoolInfo.logo} 
              alt="Logo" 
              className="w-full h-full object-contain" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + schoolInfo.name + '&background=f97316&color=fff';
              }}
            />
          ) : (
            <GraduationCap className="w-8 h-8 text-white" />
          )}
        </div>
        <div>
          <h2 className="font-black text-xl tracking-tight">{schoolInfo.name}</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{data.term}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-slate-400 uppercase">Bulletin de Notes</p>
        <p className="text-sm font-black text-orange-600">Année Scolaire</p>
      </div>
    </div>

    <div className="bg-slate-900 rounded-3xl p-8 text-white mb-8 flex justify-between items-center relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1 font-black">Élève</p>
        <h3 className="text-3xl font-black mb-2">{data.student.name}</h3>
        <div className="flex gap-4 text-sm text-slate-300 font-medium">
          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {data.student.class}</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Rang: {data.rank}/{data.totalStudents}</span>
        </div>
      </div>
      <div className="text-right relative z-10">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 font-black">Moyenne</p>
        <p className="text-5xl font-black text-orange-500">{data.overallAverage.toFixed(2)}</p>
      </div>
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="md:col-span-2 space-y-4">
        <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Détails des Notes
        </h4>
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Matière</th>
                <th className="px-6 py-4 text-center">Coef</th>
                <th className="px-6 py-4 text-center">Note</th>
                <th className="px-6 py-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.subjectAverages.map((s: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm">{s.name}</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-500">{s.coef}</td>
                  <td className="px-6 py-4 text-center font-black text-sm">{s.average.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      s.average >= 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {s.average >= 10 ? 'Validé' : 'Échec'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
          <h4 className="font-bold text-sm text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Synthèse Pédagogique
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed italic">
            "{data.aiComment}"
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
          <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Décision Finale</h4>
          <div className={`text-center py-4 rounded-2xl font-black text-xl ${
            data.decision === 'Admis' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
          }`}>
            {data.decision.toUpperCase()}
          </div>
        </div>
      </div>
    </div>

    <div className="pt-10 border-t border-slate-100 flex justify-between items-end">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Généré le</p>
        <p className="text-sm font-bold">{data.date}</p>
      </div>
      <div className="flex gap-12">
        <div className="text-center border-t border-slate-200 pt-2 w-32">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Titulaire</p>
        </div>
        <div className="text-center border-t border-slate-200 pt-2 w-32">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Direction</p>
        </div>
      </div>
    </div>
  </div>
);

const SimpleBulletin = ({ data, schoolInfo }: { data: any, schoolInfo: any }) => (
  <div className="max-w-2xl mx-auto py-10 px-6 font-sans text-slate-800">
    <div className="text-center mb-12">
      <h1 className="text-3xl font-light tracking-tight mb-2">{schoolInfo.name}</h1>
      <p className="text-slate-400 text-sm uppercase tracking-widest">{data.term}</p>
    </div>

    <div className="mb-12 space-y-1">
      <p className="text-sm text-slate-400 uppercase tracking-widest">Bulletin de</p>
      <h2 className="text-4xl font-black text-slate-900">{data.student.name}</h2>
      <p className="text-lg text-slate-500 font-medium">{data.student.class}</p>
    </div>

    <div className="space-y-6 mb-12">
      {data.subjectAverages.map((s: any, i: number) => (
        <div key={i} className="flex justify-between items-center group">
          <span className="text-lg font-medium group-hover:text-orange-500 transition-colors">{s.name}</span>
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-400">coef {s.coef}</span>
            <span className="text-2xl font-black w-16 text-right">{s.average.toFixed(1)}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="border-t-2 border-slate-900 pt-8 flex justify-between items-baseline mb-12">
      <span className="text-2xl font-black uppercase tracking-widest">Moyenne</span>
      <span className="text-6xl font-black">{data.overallAverage.toFixed(2)}</span>
    </div>

    <div className="bg-slate-50 p-8 rounded-2xl mb-12">
      <p className="text-sm leading-relaxed text-slate-600 italic">
        "{data.aiComment}"
      </p>
    </div>

    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
      <span>Rang: {data.rank}/{data.totalStudents}</span>
      <span>Décision: {data.decision}</span>
    </div>
  </div>
);

const PremiumBulletin = ({ data, schoolInfo }: { data: any, schoolInfo: any }) => (
  <div className="font-sans text-slate-900">
    <div className="flex gap-8 mb-10">
      <div className="w-1/3 bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between">
        <div>
          {schoolInfo.logo ? (
            <img src={schoolInfo.logo} alt="Logo" className="w-12 h-12 object-contain mb-6" referrerPolicy="no-referrer" />
          ) : (
            <GraduationCap className="w-12 h-12 text-orange-500 mb-6" />
          )}
          <h2 className="text-2xl font-black leading-tight mb-2">{schoolInfo.name}</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{data.student.class}</p>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Moyenne</p>
            <p className="text-3xl font-black text-orange-500">{data.overallAverage.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Rang</p>
            <p className="text-3xl font-black">{data.rank}/{data.totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-4xl font-black tracking-tight">{data.student.name}</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">{data.term} • Rapport Premium</p>
          </div>
          <div className="text-right">
            <div className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest ${
              data.decision === 'Admis' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}>
              {data.decision}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data.subjectAverages.map((s: any, i: number) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100 hover:border-orange-200 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:text-orange-500 transition-colors">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Coefficient {s.coef}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${(s.average / 20) * 100}%` }} />
                </div>
                <span className="font-black text-lg w-12 text-right">{s.average.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3 mb-4">
            <BadgeCheck className="w-5 h-5 text-slate-900" />
            <h4 className="font-black text-sm uppercase tracking-widest">Observation de la Direction</h4>
          </div>
          <p className="text-slate-700 leading-relaxed font-medium italic">
            "{data.aiComment}"
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Types
type UserRole = 'admin' | 'secretary' | 'teacher';
type SubscriptionPlan = 'free' | 'premium' | 'pro';
type AttendanceStatus = 'Présent' | 'Absent' | 'Retard' | 'Justifié';

interface Grade {
  id: string;
  studentId: string;
  studentName?: string;
  subject: string;
  score: number;
  maxScore: number;
  coefficient: number;
  date: string;
  term: string;
  type?: 'quiz' | 'test' | 'exam' | 'exam_rapid';
}

interface SubjectConfig {
  id: string;
  name: string;
  coefficient: number;
  category: 'Sciences' | 'Langues' | 'Lettres' | 'Autres';
}

interface StudentDocument {
  id: string;
  name: string;
  url: string; // Base64 ou URL
  category: 'Extrait de naissance' | 'Photo d\'identité' | 'Certificat médical' | 'Diplôme' | 'Bulletin' | 'Autre';
  dateAdded: string;
  size?: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
  dateAdded: string;
  matricule: string;
  totalFees: number;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  documents?: StudentDocument[];
  notes?: string;
}

interface SchoolClass {
  id: string;
  name: string;
  gradeLevel: string;
  subjects?: SubjectConfig[];
  annualFees?: number;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  contact: string;
  email?: string;
  userId?: string;
  salary?: number;
  role?: 'teacher' | 'secretary' | 'admin';
  staffRole?: string;
}

interface ScheduleEntry {
  id: string;
  classId: string;
  teacherId: string;
  subject: string;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  startTime: string;
  endTime: string;
  room: string;
}

interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: 'Espèces' | 'Orange Money' | 'Moov Money' | 'Wave Money' | 'Autre';
  date: string;
}

interface Expense {
  id: string;
  category: 'Salaire' | 'Loyer' | 'Eau/Électricité' | 'Fournitures' | 'Autre';
  amount: number;
  description: string;
  date: string;
}

interface SMSMessage {
  id: string;
  recipient: string;
  content: string;
  date: string;
  status: 'Envoyé' | 'Échec';
}

interface Exam {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  className: string;
  subject: string;
  room: string;
  type: 'Interrogation' | 'Devoir' | 'Composition' | 'Examen';
}

interface Bulletin {
  id: string;
  studentId: string;
  term: string;
  average: number;
  rank: string;
  comment: string;
  date: string;
}

interface PreRegistration {
  id: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  requestedClass?: string;
  status: 'pending' | 'contacted' | 'accepted' | 'rejected';
  date: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: AttendanceStatus;
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'Livre' | 'Uniforme' | 'Fourniture' | 'Autre';
  quantity: number;
  unitPrice: number;
  costPrice: number;
  minStock: number;
}

interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'Achat' | 'Vente' | 'Prêt' | 'Retour' | 'Ajustement' | 'Don';
  quantity: number;
  studentId?: string;
  studentName?: string;
  date: string;
  notes?: string;
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: ElementType;
  color: string;
}

// Components
const SaaSLandingPage = ({ onGetStarted, onParentPortal }: { onGetStarted: () => void, onParentPortal: () => void }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Est-ce que mes données sont sécurisées ?", a: "Oui, SchoolCore utilise le chiffrement de bout en bout et l'infrastructure Google Cloud pour garantir que les données de vos élèves restent confidentielles." },
    { q: "Puis-je utiliser l'application sans internet ?", a: "L'application nécessite une connexion pour synchroniser les données, mais elle est optimisée pour consommer très peu de bande passante." },
    { q: "Quels sont les modes de paiement acceptés ?", a: "Nous acceptons Orange Money, Moov Money et Wave Money pour une flexibilité totale au Mali." },
    { q: "L'IA remplace-t-elle les enseignants ?", a: "Pas du tout ! L'IA est un outil pour aider les enseignants à gagner du temps sur les tâches administratives comme les commentaires de bulletins." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-100">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              School<span className="text-orange-600">Core</span>
            </h1>
         </div>
         <div className="flex items-center gap-4">
           <button 
             onClick={onParentPortal}
             className="text-slate-600 font-bold text-sm hover:text-orange-600 transition-colors"
           >
             Accès Parent
           </button>
           <button 
             onClick={onGetStarted}
             className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-orange-600 transition-all"
           >
             Connexion
           </button>
         </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
           >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 mb-6 font-bold uppercase tracking-widest text-[10px]">
                 <Sparkles className="w-3 h-3" />
                 <span>L'avenir de l'éducation</span>
              </div>
              <h2 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 italic">
                Gérez votre école avec <span className="text-orange-600">intelligence.</span>
              </h2>
              <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed">
                SchoolCore est la plateforme SaaS tout-en-un pour moderniser la gestion scolaire en Afrique de l'Ouest. IA, suivi en temps réel et facturation simplifiée.
              </p>
              <div className="flex flex-wrap gap-4">
                 <button 
                   onClick={onGetStarted}
                   className="bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-orange-700 hover:scale-105 transition-all shadow-xl shadow-orange-500/20"
                 >
                   Commencer gratuitement
                 </button>
                 <div className="flex items-center gap-2 px-6 py-5 rounded-[2rem] border border-slate-200 text-slate-600 font-bold">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                    Bientôt sur Mobile
                 </div>
                 <div className="w-full">
                    <p className="text-slate-400 font-medium text-xs flex items-center gap-2">
                       <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                       Réservez la place de votre enfant en 2 minutes
                    </p>
                 </div>
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 max-w-xl">
                 <div className="flex -space-x-3 items-center">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                          {['ML', 'BF', 'CI', 'SN'][i-1]}
                       </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-600 flex items-center justify-center text-[8px] font-black text-white">
                       100+
                    </div>
                 </div>
                 <div className="flex-1">
                    <p className="text-slate-900 font-bold text-sm">Disponible partout au Mali</p>
                    <p className="text-xs text-slate-500 italic mt-0.5">Plus de 100 établissements font confiance à SchoolCore pour leur transformation numérique.</p>
                 </div>
              </div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="relative"
           >
              <div className="absolute -inset-4 bg-orange-500/5 rounded-[3rem] blur-3xl" />
              <div className="relative bg-slate-900 rounded-[3rem] p-4 lg:p-8 aspect-square flex items-center justify-center overflow-hidden border border-slate-800 shadow-2xl">
                 <div className="grid grid-cols-2 gap-4 w-full">
                    {[
                      { icon: LayoutDashboard, color: 'bg-emerald-500', label: 'Dashboard' },
                      { icon: GraduationCap, color: 'bg-orange-500', label: 'Académique' },
                      { icon: CreditCard, color: 'bg-orange-600', label: 'Finances' },
                      { icon: MessageSquare, color: 'bg-purple-500', label: 'Contact Parents' }
                    ].map((feat, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        key={i} 
                        className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-white/10 transition-colors"
                      >
                         <div className={`p-4 rounded-2xl ${feat.color}`}>
                            <feat.icon className="w-8 h-8 text-white" />
                         </div>
                         <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{feat.label}</span>
                      </motion.div>
                    ))}
                 </div>
              </div>
           </motion.div>
        </div>

        <section className="mt-40">
           <div className="text-center mb-16 px-4">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">Pourquoi nous choisir ?</h2>
              <p className="text-slate-500 mt-4 font-medium text-lg max-w-2xl mx-auto">L'excellence au service de l'éducation moderne pour accompagner chaque établissement vers le succès.</p>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Suivi des parents par SMS", desc: "Recevez les notes et absences de vos enfants directement sur votre mobile en temps réel.", icon: Send },
                { title: "Gestion moderne de l’école", desc: "Digitalisez vos archives, facturations et emplois du temps avec une interface intuitive.", icon: Zap },
                { title: "Encadrement de qualité", desc: "Un environnement structuré et des outils d'IA pour assurer le succès pédagogique.", icon: Award }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl hover:shadow-orange-500/10 transition-all group border-b-8 border-transparent hover:border-orange-500">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-colors">
                      <item.icon className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                   <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        <section className="mt-40 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { 
               title: "Intelligence Artificielle", 
               desc: "Générez des appréciations automatiques et des rapports d'analyse en un clic grâce à Gemini IA.",
               icon: Sparkles
             },
             { 
               title: "Suivi Parents Direct", 
               desc: "Oubliez les matricules complexes. Envoyez des alertes SMS automatiques par classe pour un suivi proactif.",
               icon: MessageSquare
             },
             { 
               title: "Gestion Centralisée", 
               desc: "Élèves, notes, assiduité et finances au même endroit, accessibles partout.",
               icon: ShieldCheck
             },
             { 
               title: "Paiements Mobiles", 
               desc: "Gestion des factures et suivi des abonnements via Orange, Moov ou Wave Money.",
               icon: Zap
             }
           ].map((item, i) => (
             <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-orange-100 transition-all hover:shadow-xl group">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                   <item.icon className="w-6 h-6 text-orange-600 group-hover:text-white" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </section>
         <section className="mt-40 bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 blur-[100px] -mr-48 -mt-48"></div>
            <div className="max-w-4xl space-y-12 relative z-10">
               <div>
                  <h3 className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs mb-4">Accessibilité Mondiale</h3>
                  <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9]">
                    Connectez votre école au <span className="text-orange-500 underline decoration-8 decoration-white/10 underline-offset-8">Cloud.</span>
                  </h2>
               </div>
               <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-orange-500" />
                     </div>
                     <h4 className="text-lg font-bold">Zéro Installation</h4>
                     <p className="text-slate-400 text-sm leading-relaxed">Pas de serveur à acheter, pas de logiciel à installer. SchoolCore fonctionne directement dans votre navigateur web, sur PC, tablette ou smartphone.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-orange-500" />
                     </div>
                     <h4 className="text-lg font-bold">Optimisé pour le Mali</h4>
                     <p className="text-slate-400 text-sm leading-relaxed">Conçu pour fonctionner même avec une connexion internet limitée. Accédez à vos rapports administratifs à tout moment, depuis n'importe quelle ville du pays.</p>
                  </div>
               </div>
            </div>
         </section>

         <section className="mt-40 mb-20 px-4 text-center">
            <div className="mb-16">
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Questions Fréquentes</h2>
               <p className="text-slate-500 mt-2 font-medium">Tout ce que vous devez savoir pour commencer.</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4 text-left">
               {faqs.map((faq, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
                      activeFaq === i 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-slate-50 border-slate-100 hover:border-orange-200'
                    }`}
                  >
                     <h4 className="font-bold text-slate-900 flex items-center justify-between">
                        {faq.q}
                        <ChevronRight className={`w-4 h-4 transition-all ${
                          activeFaq === i ? 'text-orange-500 rotate-90' : 'text-slate-300'
                        }`} />
                     </h4>
                     {activeFaq === i && (
                       <p className="mt-4 text-sm text-slate-500 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                         {faq.a}
                       </p>
                     )}
                  </div>
                ))}
            </div>
         </section>
      </main>

      <footer className="py-12 px-6 border-t border-slate-50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                School<span className="text-orange-600">Core</span>
              </h1>
           </div>
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
             © SchoolCore • Premium SaaS Edition • Conçu pour l'Afrique de l'Éducation
           </p>
        </div>
      </footer>
    </div>
  );
};

const ParentPortal = ({ onBack, students, attendance, grades, schoolInfo }: { onBack: () => void, students: Student[], attendance: AttendanceRecord[], grades: Grade[], schoolInfo: any }) => {
  const [matriculeInput, setMatriculeInput] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.matricule.toLowerCase() === matriculeInput.trim().toLowerCase());
    setFoundStudent(student || null);
    setHasSearched(true);
  };

  const studentAttendance = foundStudent ? attendance.filter(a => a.studentId === foundStudent.id).reverse() : [];
  const latestGrade = foundStudent ? grades.filter(g => g.studentId === foundStudent.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100">
      <div className="max-w-2xl mx-auto pt-16 pb-20 px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 font-bold text-sm"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Retour
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portail Parent</h2>
            <p className="text-slate-500 mt-2">Suivez le parcours de votre enfant en temps réel.</p>
            <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
              <p className="text-xs text-orange-700 leading-normal font-medium text-left">
                <strong>Nouveau :</strong> Pour plus de simplicité, SchoolCore envoie désormais des notifications SMS directes sur votre mobile pour les notes, absences et paiements.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <input 
                type="text"
                value={matriculeInput}
                onChange={(e) => setMatriculeInput(e.target.value)}
                placeholder="Entrez le matricule (ex: SC-XXXXX)"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-center text-lg font-bold placeholder:text-slate-300 focus:border-orange-500 focus:bg-white outline-none transition-all"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none" />
            </div>
            <button 
              type="submit"
              className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20"
            >
              Consulter le profil
            </button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {!hasSearched ? null : foundStudent ? (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/20">
                    {foundStudent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase">{foundStudent.name}</h3>
                    <p className="text-orange-600 font-bold">{foundStudent.class}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dernière note</p>
                    {latestGrade ? (
                      <div>
                        <p className="text-xl font-black text-slate-900">{latestGrade.score}/{latestGrade.maxScore}</p>
                        <p className="text-xs font-bold text-slate-500">{latestGrade.subject}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">Aucune note</p>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Présence</p>
                    {studentAttendance[0] ? (
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase mb-1 ${
                          studentAttendance[0].status === 'Présent' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {studentAttendance[0].status}
                        </span>
                        <p className="text-xs font-bold text-slate-500">{new Date(studentAttendance[0].date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">Non marqué</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                   <h4 className="font-bold text-sm text-slate-900 mb-4">Contact École</h4>
                   <a 
                     href={`https://wa.me/${schoolInfo.phone.replace(/[^0-9]/g, '')}`}
                     target="_blank"
                     rel="noreferrer"
                     className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-2xl font-black hover:opacity-90 transition-opacity"
                   >
                     <Phone className="w-5 h-5" />
                     Contacter via WhatsApp
                   </a>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 overflow-hidden">
                <h4 className="font-bold text-sm text-slate-900 mb-4">Historique de présence</h4>
                <div className="space-y-3">
                  {studentAttendance.slice(0, 5).map((a, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                      <p className="text-xs font-bold text-slate-600">{new Date(a.date).toLocaleDateString('fr-FR')}</p>
                      <span className={`text-[10px] font-black uppercase ${
                        a.status === 'Présent' ? 'text-emerald-500' : 'text-red-500'
                      }`}>{a.status}</span>
                    </div>
                  ))}
                  {studentAttendance.length === 0 && <p className="text-center py-4 text-slate-400 text-sm">Aucun historique disponible.</p>}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="no-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white border-2 border-slate-100 p-8 rounded-[2rem] text-center shadow-lg"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-rose-500" />
              </div>
              <p className="text-slate-900 font-black text-xl mb-2">Matricule introuvable</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Nous n'avons pas trouvé d'élève correspondant à ce matricule. <br/>
                Veuillez vérifier le code ou contacter l'administration de l'établissement.
              </p>
              <div className="flex flex-col gap-3">
                <a 
                  href={`tel:${schoolInfo.contact || ''}`}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Appeler l'école
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PaymentReceipt = ({ transaction, schoolInfo, onClose }: { transaction: Transaction, schoolInfo: any, onClose: () => void }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-receipt');
    if (!element) return;
    
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Recu_${transaction.id.slice(-6).toUpperCase()}_${transaction.studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erreur PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer ou utiliser la fonction "Imprimer".');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:w-full"
      >
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center print:hidden">
           <h3 className="font-bold text-slate-800">Aperçu du Reçu</h3>
           <div className="flex gap-2">
              <button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-4 h-4" /> Imprimer
              </button>
              <button 
                onClick={onClose}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Fermer
              </button>
           </div>
        </div>

        <div className="p-10 bg-white" id="printable-receipt">
           {/* Receipt Header */}
           <div className="flex justify-between items-start mb-10">
              <div>
                <div className="w-20 h-20 mb-4 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                   {schoolInfo.logo ? (
                     <img src={schoolInfo.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                   ) : (
                     <ShieldCheck className="w-10 h-10 text-slate-200" />
                   )}
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase leading-tight">{schoolInfo.name}</h2>
                <p className="text-xs text-slate-500 font-bold">{schoolInfo.address}</p>
                <p className="text-xs text-slate-500 font-bold">{schoolInfo.phone}</p>
              </div>
              <div className="text-right">
                <div className="bg-slate-900 text-white px-6 py-2 rounded-lg inline-block mb-4">
                  <h1 className="text-xl font-black uppercase">Reçu de Paiement</h1>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">N° Reçu</p>
                <p className="text-sm font-black text-slate-900">RCP-{transaction.id.slice(-6).toUpperCase()}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">Date</p>
                <p className="text-sm font-black text-slate-900">{transaction.date}</p>
              </div>
           </div>

           {/* Receipt Body */}
           <div className="border-y-2 border-slate-900 py-8 mb-8">
              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Élève</p>
                    <p className="text-lg font-black text-slate-900 uppercase">{transaction.studentName}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mode de règlement</p>
                    <p className="text-lg font-black text-slate-900">{transaction.method}</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-50 p-8 rounded-2xl mb-8 flex justify-between items-center">
              <div>
                 <p className="text-xs font-bold text-slate-500 uppercase">Montant versé</p>
                 <p className="text-4xl font-black text-slate-900">{transaction.amount.toLocaleString()} FCFA</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-400 uppercase">En lettres</p>
                 <p className="text-xs font-bold italic text-slate-600">Somme perçue avec succès</p>
              </div>
           </div>

           {/* Signature areas */}
           <div className="grid grid-cols-2 gap-12 pt-12">
              <div className="text-center">
                 <p className="text-xs font-bold uppercase underline mb-16">Le Parent d'Élève</p>
                 <div className="border-t border-dashed border-slate-300 w-32 mx-auto"></div>
              </div>
              <div className="text-center">
                 <p className="text-xs font-bold uppercase underline mb-16">Engagement Comptable</p>
                 <p className="text-[9px] font-bold italic text-slate-400 mb-8">(Signature et Cachet)</p>
                 <div className="border-t border-dashed border-slate-300 w-32 mx-auto"></div>
              </div>
           </div>

           <div className="mt-20 pt-8 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                 Merci pour votre confiance • SchoolCore Financial System
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProspectsManagement = ({ schoolId, students, subscriptionPlan }: { schoolId: string, students: Student[], subscriptionPlan: SubscriptionPlan }) => {
  const [prospects, setProspects] = useState<PreRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (schoolId) {
      const q = query(collection(db, 'schools', schoolId, 'pre_registrations'), orderBy('date', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        setProspects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PreRegistration)));
        setLoading(false);
      }, (error) => handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/pre_registrations`));
      return unsub;
    }
  }, [schoolId]);

  const updateProspectStatus = async (id: string, status: PreRegistration['status']) => {
    try {
      const prospect = prospects.find(p => p.id === id);
      if (!prospect) return;

      // Update status in pre_registrations
      await updateDoc(doc(db, 'schools', schoolId, 'pre_registrations', id), { status });

      // If accepted, auto-enroll as student
      if (status === 'accepted') {
        const limits = { free: 50, premium: 300, pro: Infinity };
        if (students.length >= (limits[subscriptionPlan as keyof typeof limits] || 50)) {
          alert("Limite de plan atteinte. L'élève est marqué comme accepté mais n'a pas pu être enrôlé automatiquement.");
          return;
        }

        // Check if already enrolled (by name or matricule if possible, but here we just create a new one)
        const studentId = `student_${prospect.id}`;
        const matricule = `SC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        
        const newStudent: Student = {
          id: studentId,
          name: prospect.studentName,
          class: prospect.requestedClass || 'Non spécifiée',
          dateAdded: new Date().toISOString().split('T')[0],
          parentName: prospect.parentName,
          parentPhone: prospect.parentPhone,
          parentEmail: prospect.parentEmail,
          totalFees: 50000, // Default fee
          matricule
        };

        await setDoc(doc(db, 'schools', schoolId, 'students', studentId), newStudent);
        alert(`${prospect.studentName} a été enrôlé avec succès !`);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `schools/${schoolId}/pre_registrations/${id}`);
    }
  };

  const deleteProspect = async (id: string) => {
    if (safeConfirm("Supprimer ce prospect ?")) {
      try {
        await deleteDoc(doc(db, 'schools', schoolId, 'pre_registrations', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `schools/${schoolId}/pre_registrations/${id}`);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight underline decoration-orange-500 decoration-8 underline-offset-4">Pré-inscriptions en ligne</h2>
            <p className="text-slate-500 font-medium italic mt-2">Gérez les demandes reçues via votre page vitrine.</p>
          </div>
          <div className="bg-orange-50 text-orange-600 px-6 py-2 rounded-2xl border border-orange-100 flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-black uppercase tracking-widest">{prospects.length} Prospects</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-6 py-4">Élève</th>
                <th className="px-6 py-4">Parent / Contact</th>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {prospects.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900">{p.studentName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-600">{p.parentName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <a 
                        href={`tel:${p.parentPhone}`} 
                        className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Phone className="w-3 h-3" />
                        {p.parentPhone}
                      </a>
                      {p.parentEmail && <span className="text-[10px] text-slate-400 font-medium">• {p.parentEmail}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-600">{p.requestedClass || 'Non spécifiée'}</span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {p.date ? new Date(p.date).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={p.status}
                      onChange={(e) => updateProspectStatus(p.id, e.target.value as any)}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full outline-none transition-colors ${
                        p.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        p.status === 'contacted' ? 'bg-blue-100 text-blue-600' :
                        p.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-rose-100 text-rose-600'
                      }`}
                    >
                      <option value="pending">En attente</option>
                      <option value="contacted">Contacté</option>
                      <option value="accepted">Accepté</option>
                      <option value="rejected">Refusé</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => updateProspectStatus(p.id, 'accepted')} className={`p-2 transition-colors ${p.status === 'accepted' ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}`}>
                          <CheckCircle className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => deleteProspect(p.id)}
                         className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {prospects.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    Aucune pré-inscription pour le moment. Partagez votre lien de page vitrine !
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExamsModule = ({ exams, classes, students, schoolId, schoolInfo, grades }: { exams: Exam[], classes: SchoolClass[], students: Student[], schoolId: string, schoolInfo: any, grades: Grade[] }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null);
  const [showConfirmDeleteForGrades, setShowConfirmDeleteForGrades] = useState(false);

  const [newExam, setNewExam] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    className: '',
    subject: '',
    room: '',
    type: 'Trimestriel'
  });

  const [selectedExamForGrades, setSelectedExamForGrades] = useState<Exam | null>(null);
  const [entryGrades, setEntryGrades] = useState<Record<string, string>>({});
  const [isSavingGrades, setIsSavingGrades] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  const handleAddExam = async (e: FormEvent) => {
    e.preventDefault();
    const id = editingExamId || Date.now().toString();
    try {
      await setDoc(doc(db, 'schools', schoolId, 'exams', id), {
        ...newExam,
        id
      });
      setIsAdding(false);
      setEditingExamId(null);
      setNewExam({
        name: '',
        date: '',
        startTime: '',
        endTime: '',
        className: '',
        subject: '',
        room: '',
        type: 'Trimestriel'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/exams/${id}`);
    }
  };

  const handleRemoveExam = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'exams', id));
      setDeletingExamId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `schools/${schoolId}/exams/${id}`);
    }
  };

  const handleEditExamClick = (exam: Exam) => {
    setEditingExamId(exam.id);
    setNewExam({
      name: exam.name,
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      className: exam.className,
      subject: exam.subject,
      room: exam.room,
      type: exam.type as any
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const printRoomList = (exam: Exam) => {
    const examStudents = students.filter(s => s.class === exam.className);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Veuillez autoriser les popups pour imprimer la liste.");
      return;
    }

    const content = `
      <html>
        <head>
          <title>Liste d'Examen - ${exam.className}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #1e293b; line-height: 1.5; }
              .no-print { display: none; }
            }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 4px double #0f172a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .school-identity { text-align: left; }
            .school-name { font-size: 24px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: -0.5px; }
            .school-sub { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-top: 2px; }
            .doc-title { text-align: right; }
            .doc-type { font-size: 20px; font-weight: 900; color: #f97316; }
            .doc-id { font-size: 10px; font-weight: bold; color: #94a3b8; }
            
            .info-bar { display: grid; grid-template-cols: repeat(4, 1fr); gap: 1px; background: #e2e8f0; border: 1px solid #e2e8f0; margin-bottom: 30px; border-radius: 8px; overflow: hidden; }
            .info-cell { background: white; padding: 12px; }
            .info-lbl { font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 3px; }
            .info-val { font-size: 12px; font-weight: bold; color: #0f172a; }

            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; font-size: 10px; font-weight: 900; color: #475569; text-transform: uppercase; text-align: left; }
            td { border: 1px solid #cbd5e1; padding: 10px; font-size: 11px; }
            .col-num { width: 30px; text-align: center; color: #94a3b8; font-weight: bold; }
            .col-mat { width: 90px; font-family: monospace; font-weight: bold; color: #64748b; }
            .col-name { font-weight: bold; text-transform: uppercase; color: #0f172a; }
            .col-sign { width: 150px; }
            .col-grade { width: 70px; text-align: center; background: #fdfcfb; }

            .summary-section { display: flex; gap: 20px; margin-bottom: 40px; }
            .summary-box { flex: 1; border: 1px dashed #cbd5e1; padding: 15px; border-radius: 12px; }
            .summary-title { font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 15px; }
            .summary-line { border-bottom: 1px solid #f1f5f9; height: 30px; margin-bottom: 10px; }

            .footer-sigs { display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 30px; margin-top: 50px; }
            .sig-area { text-align: center; }
            .sig-label { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 60px; }
            .sig-line { border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-identity">
              <div class="school-name">${schoolInfo.name}</div>
              <div class="school-sub">Direction des Examens et Concours • République du Mali</div>
            </div>
            <div class="doc-title">
              <div class="doc-type">FEUILLE D'ÉMARGEMENT</div>
              <div class="doc-id">REF: EXM-${exam.id.substring(0, 8)}</div>
            </div>
          </div>

          <div class="info-bar">
            <div class="info-cell">
              <div class="info-lbl">Examen</div>
              <div class="info-val">${exam.name}</div>
            </div>
            <div class="info-cell">
              <div class="info-lbl">Matière</div>
              <div class="info-val">${exam.subject}</div>
            </div>
            <div class="info-cell">
              <div class="info-lbl">Classe</div>
              <div class="info-val">${exam.className}</div>
            </div>
            <div class="info-cell">
              <div class="info-lbl">Salle / Localité</div>
              <div class="info-val">${exam.room}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; font-weight: bold; color: #64748b;">
            <div>DATE: ${new Date(exam.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</div>
            <div>HORAIRE: ${exam.startTime} - ${exam.endTime}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th class="col-num">N°</th>
                <th class="col-mat">Matricule</th>
                <th>Nom et Prénoms</th>
                <th class="col-sign">Émargement</th>
                <th class="col-grade">Note / 20</th>
              </tr>
            </thead>
            <tbody>
              ${examStudents.map((s, i) => `
                <tr>
                  <td class="col-num">${i + 1}</td>
                  <td class="col-mat">${s.matricule || 'N/A'}</td>
                  <td class="col-name">${s.name}</td>
                  <td class="col-sign"></td>
                  <td class="col-grade"></td>
                </tr>
              `).join('')}
              ${Array.from({ length: Math.max(0, 5 - examStudents.length % 5) }).map(() => `
                <tr style="height: 35px">
                  <td class="col-num"></td>
                  <td class="col-mat"></td>
                  <td class="col-name"></td>
                  <td class="col-sign"></td>
                  <td class="col-grade"></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-section">
            <div class="summary-box">
              <div class="summary-title">Procès-verbal de session</div>
              <div class="summary-line">Nombre de présents:</div>
              <div class="summary-line">Nombre d'absents:</div>
              <div class="summary-line">Incidents notables:</div>
            </div>
          </div>

          <div class="footer-sigs">
            <div class="sig-area">
              <div class="sig-label">Le Surveillant</div>
              <div class="sig-line">Nom & Signature</div>
            </div>
            <div class="sig-area">
              <div class="sig-label">Le Chef de Centre</div>
              <div class="sig-line">Cachet & Signature</div>
            </div>
            <div class="sig-area">
              <div class="sig-label">Correcteur</div>
              <div class="sig-line">Nom & Note Finale</div>
            </div>
          </div>

          <script>
            window.onload = () => {
              window.print();
              // window.close(); // Optional: close window after print dialog
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  const handleOpenGradeEntry = (exam: Exam) => {
    setSelectedExamForGrades(exam);
    setStudentSearch('');
    
    // Load existing grades if they exist
    const existing: Record<string, string> = {};
    const examStudentsList = students.filter(s => s.class === exam.className);
    examStudentsList.forEach(student => {
      const gradeId = `exam_grade_${exam.id}_${student.id}`;
      const found = grades.find(g => g.id === gradeId);
      if (found) {
        existing[student.id] = found.score.toString();
      }
    });
    setEntryGrades(existing);
  };

  const handleSaveBulkGrades = async () => {
    if (!selectedExamForGrades) return;
    setIsSavingGrades(true);
    try {
      const batch = writeBatch(db);
      Object.entries(entryGrades).forEach(([studentId, score]) => {
        if (!score) return;
        const gradeId = `exam_grade_${selectedExamForGrades.id}_${studentId}`;
        const student = students.find(s => s.id === studentId);
        batch.set(doc(db, 'schools', schoolId, 'grades', gradeId), {
          id: gradeId,
          studentId,
          studentName: student?.name || 'Inconnu',
          subject: selectedExamForGrades.subject,
          score: parseFloat(score),
          maxScore: 20,
          coefficient: 2, 
          term: selectedExamForGrades.name,
          date: new Date().toISOString(),
          type: 'exam'
        });
      });
      await batch.commit();
      alert('Notes enregistrées avec succès !');
      setSelectedExamForGrades(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/grades (bulk_exam)`);
    } finally {
      setIsSavingGrades(false);
    }
  };

  const examStudents = selectedExamForGrades 
    ? students.filter(s => s.class === selectedExamForGrades.className)
        .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || (s.matricule?.toLowerCase().includes(studentSearch.toLowerCase())))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <BadgeCheck className="w-6 h-6" />
             </div>
             Gestion des Examens
          </h2>
          <p className="text-slate-500 font-medium mt-1">Planifiez les sessions et automatisez la saisie des notes.</p>
        </div>
        <button
          onClick={() => {
            if (isAdding) {
              setEditingExamId(null);
              setNewExam({
                name: '',
                date: '',
                startTime: '',
                endTime: '',
                className: '',
                subject: '',
                room: '',
                type: 'Trimestriel'
              });
            }
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding ? 'Annuler' : 'Planifier un Examen'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-8 rounded-[2rem] border-2 border-orange-100 shadow-sm mb-6">
              <form onSubmit={handleAddExam} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Type d'Évaluation</label>
                  <select
                    required
                    value={newExam.type}
                    onChange={e => setNewExam({...newExam, type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="Trimestriel">Examen Trimestriel</option>
                    <option value="Annuel">Examen de Fin d'Année</option>
                    <option value="Blanc">Examen Blanc</option>
                    <option value="Concours">Concours Interne</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nom de la Session</label>
                  <input
                    required
                    type="text"
                    value={newExam.name}
                    onChange={e => setNewExam({...newExam, name: e.target.value})}
                    placeholder="Ex: Session Juin 2024"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Matière</label>
                  <input
                    required
                    type="text"
                    value={newExam.subject}
                    onChange={e => setNewExam({...newExam, subject: e.target.value})}
                    placeholder="Ex: Mathématiques"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Classe</label>
                  <select
                    required
                    value={newExam.className}
                    onChange={e => setNewExam({...newExam, className: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="">Sélectionner</option>
                    {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Date</label>
                  <input
                    required
                    type="date"
                    value={newExam.date}
                    onChange={e => setNewExam({...newExam, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">StartTime</label>
                    <input
                      required
                      type="time"
                      value={newExam.startTime}
                      onChange={e => setNewExam({...newExam, startTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">EndTime</label>
                    <input
                      required
                      type="time"
                      value={newExam.endTime}
                      onChange={e => setNewExam({...newExam, endTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Salle d'Examen</label>
                  <input
                    required
                    type="text"
                    value={newExam.room}
                    onChange={e => setNewExam({...newExam, room: e.target.value})}
                    placeholder="Ex: Salle 04 (Bâtiment B)"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-3">
                  <button type="submit" className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-600/20 hover:bg-orange-700 transition-all uppercase tracking-[0.2em] text-[10px] mt-4">
                    {editingExamId ? 'Enregistrer les modifications' : 'Confirmer la planification'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
      {selectedExamForGrades && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white p-10 rounded-[3rem] border-4 border-slate-900 shadow-2xl relative mb-12"
        >
          {showConfirmDeleteForGrades && (
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] mb-8 relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest leading-none">Supprimer cette session ?</h4>
                  <p className="text-[10px] text-rose-600 font-bold mt-1.5 uppercase tracking-wide">Choix définitif & irréversible.</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={async () => {
                    await handleRemoveExam(selectedExamForGrades.id);
                    setSelectedExamForGrades(null);
                    setShowConfirmDeleteForGrades(false);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all font-bold"
                >
                  Oui, Supprimer
                </button>
                <button
                  onClick={() => setShowConfirmDeleteForGrades(false)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-bold"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Saisie Rapide des Notes</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                    <span className="text-orange-600 font-black">{selectedExamForGrades.subject}</span> • {selectedExamForGrades.className}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-orange-500 transition-all duration-500" 
                         style={{ width: `${(Object.keys(entryGrades).filter(k => entryGrades[k]).length / examStudents.length) * 100}%` }}
                       />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">
                      {Object.keys(entryGrades).filter(k => entryGrades[k]).length} / {examStudents.length} SAISIES
                    </span>
                  </div>
                </div>
            </div>
            <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-8">
               <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Rechercher un élève..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
               </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfirmDeleteForGrades(true)}
                className="w-12 h-12 flex items-center justify-center hover:bg-rose-50 rounded-2xl transition-colors group"
                title="Supprimer cette session"
              >
                <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
              </button>
              <button
                onClick={() => {
                  setSelectedExamForGrades(null);
                  setShowConfirmDeleteForGrades(false);
                }}
                className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 rounded-2xl transition-colors group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-4 mb-10 scrollbar-thin scrollbar-thumb-slate-200 p-2">
             {examStudents.length > 0 ? examStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-orange-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center font-black text-slate-400 group-hover:text-orange-500 transition-colors border border-slate-100">
                         {student.name.charAt(0)}
                      </div>
                      <div>
                         <p className="font-bold text-slate-900 leading-tight">{student.name}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{student.matricule || 'Sans matricule'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        min="0"
                        max="20"
                        step="0.25"
                        placeholder="00.00"
                        className="w-24 bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-center font-black text-slate-900 text-lg focus:ring-8 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                        id={`grade-input-${student.id}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            const idx = examStudents.findIndex(s => s.id === student.id);
                            if (idx < examStudents.length - 1) {
                              const nextId = examStudents[idx + 1].id;
                              document.getElementById(`grade-input-${nextId}`)?.focus();
                            }
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            const idx = examStudents.findIndex(s => s.id === student.id);
                            if (idx > 0) {
                              const prevId = examStudents[idx - 1].id;
                              document.getElementById(`grade-input-${prevId}`)?.focus();
                            }
                          }
                        }}
                        value={entryGrades[student.id] || ''}
                        onChange={(e) => setEntryGrades({...entryGrades, [student.id]: e.target.value})}
                      />
                      <span className="text-[10px] font-black text-slate-300 uppercase vertical-bottom">/ 20</span>
                   </div>
                </div>
             )) : (
                <div className="col-span-full py-10 text-center">
                   <p className="text-slate-400 font-bold italic">Aucun élève trouvé dans cette classe.</p>
                </div>
             )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
             <button
                disabled={isSavingGrades || examStudents.length === 0}
                onClick={handleSaveBulkGrades}
                className="flex-1 bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
             >
                {isSavingGrades ? <Loader2 className="w-6 h-6 animate-spin text-orange-500" /> : <Save className="w-6 h-6 text-orange-500" />}
                Valider et Enregistrer sur le Serveur
             </button>
             <button
                onClick={() => setSelectedExamForGrades(null)}
                className="px-10 py-6 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all"
             >
                Annuler
             </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {exams.map(exam => (
          <motion.div 
            layout
            key={exam.id} 
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <BadgeCheck className="w-32 h-32" />
            </div>

            {deletingExamId === exam.id ? (
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] mb-8 relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                    <Trash2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest leading-none">Supprimer cette session ?</h4>
                    <p className="text-[10px] text-rose-600 font-bold mt-1.5 uppercase tracking-wide">Choix définitif & irréversible.</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleRemoveExam(exam.id)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all font-bold"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => setDeletingExamId(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-bold"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                     <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{exam.type}</span>
                     <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{exam.className}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditExamClick(exam)}
                      className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
                      title="Modifier cet examen"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Modifier</span>
                    </button>
                    <button
                      onClick={() => setDeletingExamId(exam.id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                      title="Supprimer la session"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Supprimer</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{exam.name}</h3>
                <div className="flex items-center gap-3 text-orange-600 bg-orange-50/50 w-fit px-4 py-2 rounded-xl border border-orange-100/50">
                   <BookOpen className="w-4 h-4" />
                   <span className="text-sm font-black uppercase tracking-widest">{exam.subject}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Calendar className="w-3 h-3" /> Date & Heure
                </p>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {new Date(exam.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs font-black text-slate-400">
                   <Clock className="w-3 h-3" /> {exam.startTime} - {exam.endTime}
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <MapPin className="w-3 h-3" /> Salle Assignée
                </p>
                <p className="text-sm font-bold text-slate-900 leading-tight">{exam.room}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight italic">Capacité réservée pour toute la classe</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <button
                onClick={() => printRoomList(exam)}
                className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                <Printer className="w-4 h-4 text-orange-500" />
                Liste d'émargement
              </button>
              <button
                onClick={() => handleOpenGradeEntry(exam)}
                className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-orange-500 text-orange-600 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-orange-500/10 active:scale-95"
              >
                <FileText className="w-4 h-4" />
                Saisie de Notes
              </button>
            </div>
          </motion.div>
        ))}

        {exams.length === 0 && (
          <div className="lg:col-span-2 py-40 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-slate-100 mb-8 shadow-xl">
              <BadgeCheck className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-[0.3em]">Session vide</h3>
            <p className="text-slate-400 mt-3 font-bold max-w-xs leading-relaxed uppercase text-[10px] tracking-widest">
              Aucun examen n'est encore programmé. Utilisez le bouton en haut à droite pour planifier une session.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const InventoryModule = ({ 
  inventory, 
  inventoryTransactions, 
  students, 
  schoolId 
}: { 
  inventory: InventoryItem[], 
  inventoryTransactions: InventoryTransaction[], 
  students: Student[], 
  schoolId: string 
}) => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState<'restock' | 'sale' | 'loan' | 'gift' | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'Fourniture',
    quantity: 0,
    unitPrice: 0,
    costPrice: 0,
    minStock: 5
  });

  const [transactionData, setTransactionData] = useState({
    quantity: 1,
    studentId: '',
    notes: ''
  });

  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    try {
      await setDoc(doc(db, 'schools', schoolId, 'inventory', id), {
        ...newItem,
        id,
        quantity: Number(newItem.quantity) || 0,
        unitPrice: Number(newItem.unitPrice) || 0,
        costPrice: Number(newItem.costPrice) || 0,
        minStock: Number(newItem.minStock) || 0
      });
      setIsAddingItem(false);
      setNewItem({ name: '', category: 'Fourniture', quantity: 0, unitPrice: 0, costPrice: 0, minStock: 5 });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/inventory/${id}`);
    }
  };

  const handleTransaction = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !isActionModalOpen) return;

    const tId = Date.now().toString();
    const quantity = Number(transactionData.quantity);
    const newQuantity = isActionModalOpen === 'restock' || isActionModalOpen === 'loan' ? // Note: loan decreases stock too
                          selectedItem.quantity + (isActionModalOpen === 'restock' ? quantity : -quantity) :
                          selectedItem.quantity - quantity;

    if (newQuantity < 0 && isActionModalOpen !== 'restock') {
      alert("Stock insuffisant !");
      return;
    }

    try {
      const batch = writeBatch(db);
      
      const tType = isActionModalOpen === 'restock' ? 'Achat' : 
                    isActionModalOpen === 'sale' ? 'Vente' : 
                    isActionModalOpen === 'gift' ? 'Don' : 'Prêt';
      
      const student = students.find(s => s.id === transactionData.studentId);

      batch.update(doc(db, 'schools', schoolId, 'inventory', selectedItem.id), {
        quantity: newQuantity
      });

      const transactionId = Date.now().toString();
      batch.set(doc(db, 'schools', schoolId, 'inventory_transactions', tId), {
        id: tId,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        type: tType,
        quantity,
        studentId: transactionData.studentId || null,
        studentName: student?.name || null,
        date: new Date().toISOString(),
        notes: transactionData.notes
      });

      // If it's a SALE, also add to school revenues
      if (isActionModalOpen === 'sale' && student) {
        const amount = selectedItem.unitPrice * quantity;
        const revenueId = `rev_${tId}`;
        batch.set(doc(db, 'schools', schoolId, 'transactions', revenueId), {
          id: revenueId,
          studentId: student.id,
          studentName: student.name,
          amount: amount,
          method: 'Espèces',
          date: new Date().toISOString(),
          description: `Vente de ${quantity} x ${selectedItem.name}`
        });
      }

      await batch.commit();
      setIsActionModalOpen(null);
      setSelectedItem(null);
      setTransactionData({ quantity: 1, studentId: '', notes: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/inventory_transactions/${tId}`);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!safeConfirm("Voulez-vous vraiment supprimer cet article de l'inventaire ?")) return;
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'inventory', itemId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `schools/${schoolId}/inventory/${itemId}`);
    }
  };

  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1 lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Package className="w-6 h-6" />
                 </div>
                 Stocks
              </h2>
           </div>
           <button 
             onClick={() => setIsAddingItem(!isAddingItem)}
             className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
           >
             {isAddingItem ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
           </button>
        </div>

        <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white">
                 <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Stock Faible</span>
           </div>
           <p className="text-3xl font-black text-slate-900 leading-none">{lowStockItems.length}</p>
           <p className="text-xs font-bold text-rose-500 mt-1 uppercase italic tracking-tighter">Articles à réapprovisionner</p>
        </div>

        <div className="bg-pink-50 p-6 rounded-[2rem] border border-pink-100">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                 <Gift className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Dons / Gratuit</span>
           </div>
           <p className="text-3xl font-black text-slate-900 leading-none">{inventoryTransactions.filter(t => t.type === 'Don').length}</p>
           <p className="text-xs font-bold text-pink-500 mt-1 uppercase italic tracking-tighter">Articles offerts ce mois</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 hidden lg:block">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                 <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Inventaire</span>
           </div>
           <p className="text-3xl font-black text-slate-900 leading-none">{inventory.reduce((acc, item) => acc + item.quantity, 0)}</p>
           <p className="text-xs font-bold text-emerald-500 mt-1 uppercase italic tracking-tighter">Unités physiques totales</p>
        </div>
      </div>

      <AnimatePresence>
        {isAddingItem && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-900 shadow-sm">
               <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nom de l'article</label>
                    <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Ex: Bescherelle 2024" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-slate-500/10 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Catégorie</label>
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as any})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-slate-500/10 outline-none transition-all">
                       <option value="Livre">Livre / Manuel</option>
                       <option value="Uniforme">Uniforme scolaire</option>
                       <option value="Fourniture">Fourniture / Papeterie</option>
                       <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Quantité Initiale</label>
                    <input required type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-slate-500/10 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Alerte Stock Bas</label>
                    <input required type="number" value={newItem.minStock} onChange={e => setNewItem({...newItem, minStock: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-slate-500/10 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Prix d'Achat (Unitaire)</label>
                    <input type="number" value={newItem.costPrice} onChange={e => setNewItem({...newItem, costPrice: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-slate-500/10 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Prix de Vente (Unitaire)</label>
                    <input type="number" value={newItem.unitPrice} onChange={e => setNewItem({...newItem, unitPrice: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-slate-500/10 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2 pt-6">
                    <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl">Ajouter au catalogue</button>
                  </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inventory List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
               <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Catalogue des Fournitures</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Article</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix de Vente</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{item.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          item.category === 'Livre' ? 'bg-blue-50 text-blue-600' :
                          item.category === 'Uniforme' ? 'bg-purple-50 text-purple-600' :
                          item.category === 'Fourniture' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className={`text-lg font-black ${item.quantity <= item.minStock ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                          {item.quantity}
                        </p>
                        {item.quantity <= item.minStock && <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter italic">Urgent</p>}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-700">
                        {item.unitPrice.toLocaleString()} F
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => { setSelectedItem(item); setIsActionModalOpen('restock'); }} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Réapprovisionner">
                             <TrendingUp className="w-4 h-4" />
                           </button>
                           <button onClick={() => { setSelectedItem(item); setIsActionModalOpen('sale'); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Vendre">
                             <CreditCard className="w-4 h-4" />
                           </button>
                           <button onClick={() => { setSelectedItem(item); setIsActionModalOpen('loan'); }} className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-all" title="Prêt">
                             <Handshake className="w-4 h-4" />
                           </button>
                           <button onClick={() => { setSelectedItem(item); setIsActionModalOpen('gift'); }} className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg transition-all" title="Don Gratuit">
                             <Gift className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500 rounded-lg transition-all" title="Supprimer">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Aucun article dans l'inventaire.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Sidebar / Modal (Compact inline approach) */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {isActionModalOpen && selectedItem ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl border-4 border-slate-800">
                 <div className="flex items-center justify-between mb-8">
                    <h4 className="text-lg font-black uppercase tracking-tight italic">
                      {isActionModalOpen === 'restock' ? 'Réapprovisionnement' : 
                       isActionModalOpen === 'sale' ? 'Vente Directe' : 
                       isActionModalOpen === 'gift' ? 'Don Gratuit' : 'Gestion de Prêt'}
                    </h4>
                    <button onClick={() => { setIsActionModalOpen(null); setSelectedItem(null); }} className="text-slate-500 hover:text-white transition-colors">
                       <X className="w-6 h-6" />
                    </button>
                 </div>

                 <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Article sélectionné</p>
                    <p className="font-bold text-xl">{selectedItem.name}</p>
                    <div className="flex justify-between items-center mt-2">
                       <p className="text-xs text-white/40 italic">{selectedItem.quantity} unités en stock</p>
                       {isActionModalOpen === 'sale' && (
                          <p className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-md">
                             {selectedItem.unitPrice.toLocaleString()} F / unité
                          </p>
                       )}
                    </div>
                 </div>

                 <form onSubmit={handleTransaction} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Quantité</label>
                       <input required type="number" min="1" value={transactionData.quantity} onChange={e => setTransactionData({...transactionData, quantity: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-xl font-black focus:ring-4 focus:ring-white/5 outline-none outline-0" />
                    </div>

                    {(isActionModalOpen === 'sale' || isActionModalOpen === 'loan' || isActionModalOpen === 'gift') && (
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Élève concerné</label>
                          <select required value={transactionData.studentId} onChange={e => setTransactionData({...transactionData, studentId: e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-sm font-bold focus:ring-4 focus:ring-white/5 outline-none outline-0 appearance-none">
                             <option value="" className="text-slate-900">Choix de l'élève</option>
                             {students.map(s => <option key={s.id} value={s.id} className="text-slate-900">{s.name} ({s.class})</option>)}
                          </select>
                       </div>
                    )}

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Notes facultatives</label>
                       <textarea value={transactionData.notes} onChange={e => setTransactionData({...transactionData, notes: e.target.value})} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-sm font-bold focus:ring-4 focus:ring-white/5 outline-none outline-0 h-24" placeholder="..." />
                    </div>

                    <button type="submit" className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${
                      isActionModalOpen === 'restock' ? 'bg-emerald-500 hover:bg-emerald-600' :
                      isActionModalOpen === 'sale' ? 'bg-blue-500 hover:bg-blue-600' : 
                      isActionModalOpen === 'gift' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-purple-500 hover:bg-purple-600'
                    }`}>
                      Confirmer l'opération
                    </button>
                 </form>
              </motion.div>
            ) : (
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm h-full flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                    <MousePointer2 className="w-10 h-10" />
                 </div>
                 <p className="text-slate-400 font-bold max-w-[200px]">Sélectionnez un article pour effectuer une vente ou un approvisionnement.</p>
              </div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-50">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Mouvements Récents</h3>
             </div>
             <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                {inventoryTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                  <div key={t.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-all flex gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                       t.type === 'Achat' ? 'bg-emerald-100 text-emerald-600' :
                       t.type === 'Vente' ? 'bg-blue-100 text-blue-600' :
                       t.type === 'Don' ? 'bg-pink-100 text-pink-600' :
                       t.type === 'Prêt' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                     }`}>
                        {t.type === 'Achat' ? <Plus className="w-4 h-4" /> : t.type === 'Don' ? <Gift className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                           <p className="font-black text-sm text-slate-900 truncate uppercase tracking-tight">{t.itemName}</p>
                           <p className="text-[8px] font-black text-slate-400 uppercase shrink-0">{new Date(t.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 italic">
                          {t.type} {t.quantity} unités {t.studentName ? `à ${t.studentName}` : ''}
                        </p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SchoolLandingPage = () => {
  const { schoolId: landingSchoolId } = useParams();
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [schoolClasses, setSchoolClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [formSent, setFormSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [requestedClass, setRequestedClass] = useState('');

  useEffect(() => {
    if (landingSchoolId) {
      const fetchSchoolData = async () => {
        try {
          const infoRef = doc(db, 'schools', landingSchoolId, 'config', 'info');
          const docSnap = await getDoc(infoRef);
          if (docSnap.exists()) {
            setSchoolInfo(docSnap.data());
          }

          const classesRef = collection(db, 'schools', landingSchoolId, 'classes');
          const snapshot = await getDocs(classesRef);
          const classesData = snapshot.docs.map(doc => doc.data() as SchoolClass);
          setSchoolClasses(classesData);
        } catch (error) {
          console.error("Error fetching school data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSchoolData();
    }
  }, [landingSchoolId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landingSchoolId) return;
    setSending(true);
    const id = Date.now().toString();
    const path = `schools/${landingSchoolId}/pre_registrations/${id}`;
    
    try {
      const registrationData: any = {
        id,
        studentName: studentName.trim(),
        parentName: parentName.trim(),
        parentPhone: parentPhone.trim(),
        status: 'pending',
        date: new Date().toISOString()
      };

      // Only add optional fields if they are not empty to avoid Firestore rule validation errors
      if (parentEmail && parentEmail.trim()) {
        registrationData.parentEmail = parentEmail.trim().toLowerCase();
      }
      if (requestedClass && requestedClass.trim()) {
        registrationData.requestedClass = requestedClass.trim();
      }

      await setDoc(doc(db, 'schools', landingSchoolId, 'pre_registrations', id), registrationData);

      // Notify Director via Email
      if (schoolInfo?.email) {
        try {
          await axios.post('/api/send-email', {
            to: schoolInfo.email,
            subject: `Nouvelle Pré-inscription : ${studentName}`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #f97316; padding: 24px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">SchoolCore</h1>
                </div>
                <div style="padding: 32px; color: #1e293b;">
                  <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 800;">Nouvelle demande de pré-inscription</h2>
                  <p style="font-size: 16px; line-height: 1.5; color: #475569;">Une nouvelle demande a été reçue via votre page vitrine "${schoolInfo.name}".</p>
                  
                  <div style="margin-top: 24px; background-color: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #f97316;">
                    <p style="margin: 8px 0; font-size: 14px;"><strong>📅 Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>🎓 Élève :</strong> ${studentName}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>📚 Classe souhaitée :</strong> ${requestedClass || 'Non précisée'}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>👤 Parent :</strong> ${parentName}</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>📞 Téléphone :</strong> ${parentPhone}</p>
                    ${parentEmail ? `<p style="margin: 8px 0; font-size: 14px;"><strong>📧 Email :</strong> ${parentEmail}</p>` : ''}
                  </div>
                  
                  <div style="margin-top: 32px; text-align: center;">
                    <p style="font-size: 12px; color: #64748b; font-style: italic;">Connectez-vous à votre portail SchoolCore pour gérer vos inscrits.</p>
                  </div>
                </div>
                <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">SchoolCore Mali - Excellence Éducative</p>
                </div>
              </div>
            `
          });
        } catch (emailError) {
          console.error("Erreur notification email (Director):", emailError);
        }
      }

      setFormSent(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Erreur lors de l'envoi de votre inscription. Veuillez vérifier votre connexion et réessayer.");
      try {
        handleFirestoreError(error, OperationType.CREATE, path);
      } catch (e) {
        // Just to ensure we don't crash if handleFirestoreError fails for some reason
      }
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
    </div>
  );

  if (!schoolInfo) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 text-center text-slate-900 font-sans">
      <div className="space-y-4">
        <h1 className="text-4xl font-black mb-4">École introuvable</h1>
        <p className="text-slate-500">Le lien que vous avez suivi semble incorrect ou l'école n'a pas encore configuré sa page vitrine.</p>
        <button onClick={() => window.history.back()} className="text-orange-600 font-bold hover:underline">Retourner en arrière</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-500/30">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
             </div>
             <h1 className="font-black text-xl text-slate-900 tracking-tight">{schoolInfo.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors hidden sm:block">
              Accès Parent
            </Link>
            <a href="#register" className="bg-orange-600 text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20">
              Pré-inscription
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Bienvenue à {schoolInfo.name}</span>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                L'excellence <br /> 
                <span className="text-orange-600 italic font-serif">pour vos enfants.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                {schoolInfo.motto || "Une institution dédiée à la formation des leaders de demain avec un encadrement pédagogique de classe mondiale au Mali."}
              </p>
              <div className="flex flex-col gap-4">
                <a 
                  href="#register" 
                  className="w-fit bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-700 transition-all shadow-2xl shadow-orange-500/30 active:scale-95"
                >
                  S'inscrire maintenant
                </a>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                  <Clock className="w-3 h-3 text-orange-500" />
                  Réservez la place de votre enfant en 2 minutes
                </p>
              </div>
              <div className="flex items-center gap-8 pt-4">
                 <div className="flex flex-col">
                    <span className="text-3xl font-black text-slate-900 leading-none">Visez</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">L'Excellence</span>
                 </div>
                 <div className="w-px h-10 bg-slate-200"></div>
                 <div className="flex flex-col">
                    <span className="text-3xl font-black text-slate-900 leading-none">{schoolClasses.length}+</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Classes</span>
                 </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="aspect-square bg-slate-200 rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                 <img 
                   src={schoolInfo.logo || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"} 
                   alt="School Hero"
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-white text-lg font-bold leading-tight italic">"{schoolInfo.motto || "L'éducation est l'arme la plus puissante pour changer le monde."}"</p>
                 </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </section>

        {/* Pourquoi nous choisir */}
        <section className="py-24 bg-slate-50 px-6 border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 shadow-sm">
                      <MessageSquare className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 uppercase">Suivi des parents par SMS</h3>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">Les parents sont informés en temps réel de l'assiduité et des performances par notification SMS directe.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 shadow-sm">
                      <LayoutDashboard className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 uppercase">Gestion moderne de l’école</h3>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">Un système intelligent pour la facturation, les bulletins et les absences, accessible partout et à tout moment.</p>
                </div>
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <GraduationCap className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-black text-slate-900 uppercase">Encadrement de qualité</h3>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">Une équipe pédagogique triée sur le volet et dévouée à l'épanouissement intellectuel de chaque élève.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Espace Parent Access */}
        <section className="py-12 bg-orange-600 px-6">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white space-y-2">
                 <h3 className="text-2xl font-black uppercase tracking-tight">Déjà inscrit ?</h3>
                 <p className="font-medium opacity-90 text-sm">Accédez à l'espace parent pour suivre les notes et l'assiduité de votre enfant en temps réel.</p>
              </div>
              <Link to="/" className="shrink-0 bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-orange-900/20 active:scale-95 flex items-center gap-2">
                 Se connecter à l'Espace Parent
                 <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
        </section>

        {/* Programs */}
        <section className="py-32 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Nos Programmes</h3>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Un cursus adapté à chaque élève</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {schoolClasses.length > 0 ? (
                schoolClasses.map(c => (
                  <div key={c.id} className="group p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-orange-500/30 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase">{c.name}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Encadrement spécialisé en {c.name} avec un focus sur la réussite académique et personnelle.
                    </p>
                    <div className="mt-10 pt-8 border-t border-slate-200 flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.gradeLevel || 'Fondamental'}</span>
                       <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 italic font-medium">Nos programmes seront bientôt affichés ici.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing/Tarifs */}
        <section className="py-20 bg-slate-50 px-6">
          <div className="max-w-7xl mx-auto">
             <div className="text-center space-y-4 mb-16">
               <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Tarification</h3>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Investissez dans l'avenir</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(schoolInfo?.tuitionFees && schoolInfo.tuitionFees.length > 0 
                  ? schoolInfo.tuitionFees 
                  : (schoolClasses.length > 0 
                      ? schoolClasses.map(c => ({ id: c.id, label: c.name, amount: c.annualFees || 50000 }))
                      : [
                          {id: '1', label: 'Maternelle', amount: 45000}, 
                          {id: '2', label: 'Primaire', amount: 60000},
                          {id: '3', label: 'Collège', amount: 75000},
                          {id: '4', label: 'Lycée', amount: 95000}
                        ]
                   )
                ).map((item: any) => (
                  <div key={item.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-orange-200 transition-all group">
                     <div>
                        <h4 className="text-lg font-black text-slate-900 uppercase mb-4 group-hover:text-orange-600 transition-colors tracking-tight">{item.label || item.name}</h4>
                        <div className="flex items-baseline gap-1 mb-6">
                           <span className="text-4xl font-black text-orange-600">{(item.amount || item.annualFees || 50000).toLocaleString()}</span>
                           <span className="text-xs font-bold text-slate-400">FCFA / an</span>
                        </div>
                        <ul className="space-y-3 mb-8">
                           {['Matériel didactique inclus', 'Suivi personnalisé', 'Rapports trimestriels'].map(feature => (
                             <li key={feature} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {feature}
                             </li>
                           ))}
                        </ul>
                     </div>
                     <button
                       onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                       className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-orange-500/20 active:scale-95"
                     >
                        S'inscrire
                     </button>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Cta / Pre-register Form */}
        <section id="register" className="py-32 bg-slate-900 relative overflow-hidden px-6">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-600 rounded-full blur-[150px]"></div>
             <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-20 items-center">
             <div className="lg:w-1/2 space-y-10">
                <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">
                  Offrez le meilleur <br /> 
                  à votre <span className="text-orange-500">enfant.</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-white font-bold text-sm">Notre Adresse</p>
                         <p className="text-slate-400 text-xs mt-1">{schoolInfo.address || "Bamako, Mali"}</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                         <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-white font-bold text-sm">Nous Contacter</p>
                         <p className="text-slate-400 text-xs mt-1">{schoolInfo.phone || "+223 00 00 00 00"}</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                         <Award className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-white font-bold text-sm">Diplômes</p>
                         <p className="text-slate-400 text-xs mt-1">Soutien aux examens nationaux (DEF, BAC)</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                         <Users className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-white font-bold text-sm">Vie Scolaire</p>
                         <p className="text-slate-400 text-xs mt-1">Activités sportives et culturelles</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:w-1/2 w-full">
                <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl relative">
                   {formSent ? (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="text-center py-20 px-4 space-y-8"
                     >
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                           <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <div className="space-y-3">
                           <h3 className="text-4xl font-black text-slate-900 leading-none lowercase first-letter:uppercase">Demande envoyée !</h3>
                           <p className="text-slate-500 font-medium text-sm">Merci de votre confiance. <br/>Notre équipe pédagogique vous contactera sous 24h.</p>
                        </div>
                        <button 
                          onClick={() => setFormSent(false)}
                          className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                        >
                          Envoyer une autre demande
                        </button>
                     </motion.div>
                   ) : (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center space-y-2 mb-10">
                           <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Inscription Rapide</h3>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Réservez une place pour votre enfant en 2 minutes</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nom de l'enfant</label>
                              <input 
                                required
                                type="text" 
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                placeholder="Ex: Moussa Sidibé"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Classe Souhaitée</label>
                              <select 
                                required
                                value={requestedClass}
                                onChange={(e) => setRequestedClass(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none"
                              >
                                 <option value="">Sélectionner</option>
                                 {schoolClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                              </select>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nom Complet du Parent</label>
                              <input 
                                required
                                type="text" 
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                                placeholder="Ex: M. Souleymane Sidibé"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Téléphone (WhatsApp)</label>
                              <input 
                                required
                                type="tel" 
                                value={parentPhone}
                                onChange={(e) => setParentPhone(e.target.value)}
                                placeholder="Ex: +223 70 00 00 00"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-slate-300"
                              />
                           </div>
                        </div>
                        <button 
                          disabled={sending}
                          type="submit"
                          className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-3"
                        >
                          {sending ? (
                            <>
                               <Loader2 className="w-5 h-5 animate-spin" />
                               Envoi en cours...
                            </>
                          ) : (
                            <>
                               <Send className="w-5 h-5" />
                               Réserver ma place
                            </>
                          )}
                        </button>
                        <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest mt-4">
                           Un conseiller SchoolCore vous contactera pour finaliser l'inscription.
                        </p>
                     </form>
                   )}
                </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-white border-t border-slate-100 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                    <GraduationCap className="w-6 h-6" />
                 </div>
                 <p className="font-black text-xl text-slate-900 tracking-tight">{schoolInfo.name}</p>
              </div>
              <p className="text-slate-400 text-xs font-medium max-w-xs">{schoolInfo.address || "Bamako, Mali"}</p>
            </div>
            
            <div className="flex gap-12">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Navigation</p>
                  <ul className="space-y-2 text-sm font-bold text-slate-600">
                    <li><a href="#" className="hover:text-orange-600 transition-colors">Accueil</a></li>
                    <li><a href="#register" className="hover:text-orange-600 transition-colors">Pré-inscription</a></li>
                    <li><Link to="/" className="hover:text-orange-600 transition-colors">Accès Parent</Link></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Contact</p>
                  <ul className="space-y-2 text-sm font-bold text-slate-600">
                    <li>{schoolInfo.phone}</li>
                    <li>{schoolInfo.email}</li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <p>© 2025 Powered by SchoolCore Mali</p>
            <div className="flex gap-4">
               <span>Confidentialité</span>
               <span>Conditions</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

const BulletinHeader = ({ schoolInfo, term }: { schoolInfo: any, term: string }) => (
  <div className="flex justify-between items-start border-b-4 border-double border-slate-900 pb-8 mb-8">
    <div className="text-center space-y-1">
      <h4 className="font-bold text-[10px] uppercase tracking-tighter">République du Mali</h4>
      <p className="text-[8px] font-medium italic">Un Peuple - Un But - Une Foi</p>
      <div className="w-10 h-10 mx-auto my-1 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
        <ShieldCheck className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-[8px] uppercase font-bold leading-tight">Ministère de l'Éducation Nationale</p>
    </div>
    <div className="text-center flex-1 px-6">
      <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 mb-1">{schoolInfo.name}</h2>
      <p className="text-[10px] font-bold text-slate-500 uppercase">{schoolInfo.address}</p>
      <div className="mt-3 inline-block border-2 border-slate-900 px-4 py-1">
        <h3 className="text-sm font-black uppercase">Bulletin de Notes</h3>
        <p className="text-[10px] font-bold">{term}</p>
      </div>
    </div>
    <div className="text-right">
       <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
          {schoolInfo.logo ? (
            <img src={schoolInfo.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          ) : (
            <GraduationCap className="w-8 h-8 text-slate-300" />
          )}
       </div>
    </div>
  </div>
);

// Communication Helpers
const getWhatsAppLink = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const finalPhone = cleanPhone.startsWith('00') ? cleanPhone.substring(2) : cleanPhone;
  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
};

const sendEmail = (email: string, subject: string, body: string) => {
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const ClassicTemplate = ({ student, studentGrades, configs, schoolInfo, term, bulletins, onUpdateBulletin }: { 
  student: Student, 
  studentGrades: Grade[], 
  configs: SubjectConfig[], 
  schoolInfo: any, 
  term: string,
  bulletins: Bulletin[],
  onUpdateBulletin?: (data: Partial<Bulletin>) => void
}) => {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const savedBulletin = bulletins.find(b => b.studentId === student.id && b.term === term);
  
  // State for all the Malian report card data
  const [malianData, setMalianData] = useState(() => {
    if (savedBulletin && (savedBulletin as any).malianData) {
      return (savedBulletin as any).malianData;
    }
    
    // Group grades by subject to calculate averages
    const subjects = configs.map(config => {
      const sGrades = studentGrades.filter(g => g.subject === config.name);
      const examGrades = sGrades.filter(g => g.type === 'exam');
      const classGrades = sGrades.filter(g => g.type !== 'exam');
      
      let moyClasse = 10;
      if (classGrades.length > 0) {
        moyClasse = classGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 20, 0) / classGrades.length;
      } else if (sGrades.length > 0) {
        moyClasse = sGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 20, 0) / sGrades.length;
      }
      
      let noteCompo = moyClasse * 2; // Default compo to Class average out of 40
      if (examGrades.length > 0) {
        noteCompo = (examGrades[0].score / examGrades[0].maxScore) * 40;
      }
      
      const moyGen = (moyClasse + noteCompo) / 3;
      const coef = config.coefficient || 2;
      const moyCoef = moyGen * coef;
      
      let observ = "Passable";
      if (moyGen >= 16) observ = "Excellent";
      else if (moyGen >= 14) observ = "Très Bien";
      else if (moyGen >= 12) observ = "Bien";
      else if (moyGen >= 10) observ = "Passable";
      else observ = "Insuffisant";
      
      return {
        name: config.name,
        moyClasse: parseFloat(moyClasse.toFixed(2)),
        noteCompo: parseFloat(noteCompo.toFixed(2)),
        moyGen: parseFloat(moyGen.toFixed(2)),
        coef,
        moyCoef: parseFloat(moyCoef.toFixed(2)),
        observ
      };
    });
    
    const totalCoef = subjects.reduce((acc, s) => acc + s.coef, 0);
    const totalMoyCoef = subjects.reduce((acc, s) => acc + s.moyCoef, 0);
    const average = totalCoef > 0 ? totalMoyCoef / totalCoef : 0;
    
    // Split name into Nom and Prénoms
    const nameParts = student.name.trim().split(/\s+/);
    const lastName = nameParts[0] || "";
    const firstNames = nameParts.slice(1).join(" ") || "";
    
    return {
      minEdu: "MINISTÈRE DE L'ÉDUCATION NATIONALE",
      academy: "AE/DOUENTZA",
      schoolName: schoolInfo.name || "Lycée Amayowo de Bandiagara (LAMAYO)",
      bpTel: schoolInfo.phone ? `Tél: ${schoolInfo.phone}` : "BP: 35 Tél: 66854563 / 76225342",
      schoolYear: "2024-2025",
      studentLastName: lastName,
      studentFirstName: firstNames,
      studentClass: student.class,
      effectif: 32,
      term: term,
      average: parseFloat(average.toFixed(2)),
      rank: savedBulletin?.rank || "12ème",
      firstAverage: 14.50,
      lastAverage: 6.20,
      classAverage: 10.45,
      decision: average >= 10 ? "Admis" : "Redouble",
      proviseur: schoolInfo.director || "Mamoudou SAGARA",
      date: new Date().toLocaleDateString('fr-FR'),
      subjects
    };
  });

  // Re-calculate the overall totals and student average whenever subjects list changes
  const updateSubjectsTotals = (newSubjects: any[]) => {
    const totalCoef = newSubjects.reduce((acc, s) => acc + s.coef, 0);
    const totalMoyCoef = newSubjects.reduce((acc, s) => acc + s.moyCoef, 0);
    const average = totalCoef > 0 ? totalMoyCoef / totalCoef : 0;
    
    setMalianData(prev => ({
      ...prev,
      subjects: newSubjects,
      average: parseFloat(average.toFixed(2)),
      decision: average >= 10 ? "Admis" : "Redouble"
    }));
    setHasChanges(true);
  };

  // Change individual cell values
  const handleCellChange = (index: number, field: string, value: any) => {
    const updatedSubjects = [...malianData.subjects];
    const sub = { ...updatedSubjects[index] };
    
    if (field === 'moyClasse') {
      sub.moyClasse = Math.min(20, Math.max(0, parseFloat(value) || 0));
      sub.moyGen = parseFloat(((sub.moyClasse + sub.noteCompo) / 3).toFixed(2));
      sub.moyCoef = parseFloat((sub.moyGen * sub.coef).toFixed(2));
    } else if (field === 'noteCompo') {
      sub.noteCompo = Math.min(40, Math.max(0, parseFloat(value) || 0));
      sub.moyGen = parseFloat(((sub.moyClasse + sub.noteCompo) / 3).toFixed(2));
      sub.moyCoef = parseFloat((sub.moyGen * sub.coef).toFixed(2));
    } else if (field === 'coef') {
      sub.coef = Math.max(1, parseInt(value) || 1);
      sub.moyCoef = parseFloat((sub.moyGen * sub.coef).toFixed(2));
    } else if (field === 'observ') {
      sub.observ = value;
    }
    
    // Auto appreciation if empty or default
    if (field !== 'observ' || !value) {
      if (sub.moyGen >= 16) sub.observ = "Excellent";
      else if (sub.moyGen >= 14) sub.observ = "Très Bien";
      else if (sub.moyGen >= 12) sub.observ = "Bien";
      else if (sub.moyGen >= 10) sub.observ = "Passable";
      else sub.observ = "Insuffisant";
    }
    
    updatedSubjects[index] = sub;
    updateSubjectsTotals(updatedSubjects);
  };

  // Import from local Excel sheet for this single student
  const handleLocalExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        if (data.length === 0) {
          alert("Le fichier Excel est vide.");
          return;
        }
        
        const updatedSubjects = malianData.subjects.map(sub => {
          const row = data.find(r => {
            const rSub = r['Matière'] || r['Matiere'] || r['Subject'] || r['Disciplines'] || '';
            return rSub.toString().toLowerCase().includes(sub.name.toLowerCase()) || 
                   sub.name.toLowerCase().includes(rSub.toString().toLowerCase());
          });
          
          if (row) {
            const moyClasseVal = row['Moy. Classe'] || row['Moyenne Classe'] || row['Moy Classe'] || row['Classe'] || sub.moyClasse;
            const noteCompoVal = row['Note Compo/40'] || row['Note Compo'] || row['Compo/40'] || row['Compo'] || sub.noteCompo;
            const coefVal = row['Coef'] || row['Coefficient'] || sub.coef;
            const observVal = row['Observations'] || row['Observation'] || row['Appréciation'] || row['Appreciation'];
            
            const moyClasse = parseFloat(moyClasseVal.toString());
            const noteCompo = parseFloat(noteCompoVal.toString());
            const coef = parseFloat(coefVal.toString());
            const moyGen = (moyClasse + noteCompo) / 3;
            const moyCoef = moyGen * coef;
            
            let observ = observVal ? observVal.toString() : "";
            if (!observ) {
              if (moyGen >= 16) observ = "Excellent";
              else if (moyGen >= 14) observ = "Très Bien";
              else if (moyGen >= 12) observ = "Bien";
              else if (moyGen >= 10) observ = "Passable";
              else observ = "Insuffisant";
            }
            
            return {
              ...sub,
              moyClasse: parseFloat(moyClasse.toFixed(2)),
              noteCompo: parseFloat(noteCompo.toFixed(2)),
              moyGen: parseFloat(moyGen.toFixed(2)),
              coef,
              moyCoef: parseFloat(moyCoef.toFixed(2)),
              observ
            };
          }
          return sub;
        });
        
        const totalCoef = updatedSubjects.reduce((acc, s) => acc + s.coef, 0);
        const totalMoyCoef = updatedSubjects.reduce((acc, s) => acc + s.moyCoef, 0);
        const average = totalCoef > 0 ? totalMoyCoef / totalCoef : 0;
        
        setMalianData(prev => ({
          ...prev,
          subjects: updatedSubjects,
          average: parseFloat(average.toFixed(2)),
          decision: average >= 10 ? "Admis" : "Redouble"
        }));
        setHasChanges(true);
        alert("Les notes de cet élève ont été importées avec succès !");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la lecture du fichier Excel. Assurez-vous d'avoir les colonnes : Matière, Moy. Classe, Note Compo/40.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      if (onUpdateBulletin) {
        await onUpdateBulletin({
          studentId: student.id,
          term,
          average: malianData.average,
          rank: malianData.rank,
          comment: malianData.subjects.map(s => `${s.name}: ${s.moyGen}`).join(', '),
          malianData: malianData // Deep persistent object
        } as any);
        setHasChanges(false);
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde du bulletin.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper values
  const totalCoefficients = malianData.subjects.reduce((acc, s) => acc + s.coef, 0);
  const weightedPointsTotal = malianData.subjects.reduce((acc, s) => acc + s.moyCoef, 0);

  return (
    <div className="bg-white p-6 md:p-8 min-h-[29.7cm] flex flex-col font-sans select-text border border-slate-200">
      {/* Control Panel (Hidden during Printing) */}
      <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-3xl flex flex-wrap justify-between items-center gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase transition-all ${
              editMode 
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Pencil className="w-4 h-4" />
            {editMode ? "Quitter le Mode Saisie" : "Saisir / Modifier les Notes"}
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-black uppercase cursor-pointer transition-all">
            <FileUp className="w-4 h-4 text-indigo-500" />
            Excel Individuel
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              onChange={handleLocalExcelImport} 
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          {hasChanges && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black uppercase tracking-wider animate-pulse">
              Modifications non enregistrées
            </span>
          )}
          
          <button
            onClick={handleSaveData}
            disabled={isSaving || !hasChanges}
            className={`flex items-center gap-2 px-6 py-2 rounded-2xl text-xs font-black uppercase transition-all shadow-md ${
              hasChanges 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      </div>

      {/* Main Official Document Container */}
      <div className="border-4 border-double border-slate-900 p-8 flex-1 flex flex-col bg-white relative">
        
        {/* Document Header */}
        <div className="grid grid-cols-3 gap-4 items-start mb-6 pb-4 border-b border-slate-200">
          
          {/* Left Column (Administrative details) */}
          <div className="text-[9px] font-bold text-slate-800 space-y-1">
            {editMode ? (
              <div className="space-y-1">
                <input 
                  type="text" 
                  value={malianData.minEdu} 
                  onChange={(e) => { setMalianData({...malianData, minEdu: e.target.value}); setHasChanges(true); }}
                  className="w-full text-[9px] font-bold border border-slate-300 rounded p-1 bg-white focus:outline-none"
                />
                <input 
                  type="text" 
                  value={malianData.academy} 
                  onChange={(e) => { setMalianData({...malianData, academy: e.target.value}); setHasChanges(true); }}
                  className="w-full text-[9px] font-bold border border-slate-300 rounded p-1 bg-white focus:outline-none"
                />
                <input 
                  type="text" 
                  value={malianData.schoolName} 
                  onChange={(e) => { setMalianData({...malianData, schoolName: e.target.value}); setHasChanges(true); }}
                  className="w-full text-[9px] font-bold border border-slate-300 rounded p-1 bg-white focus:outline-none"
                />
                <input 
                  type="text" 
                  value={malianData.bpTel} 
                  onChange={(e) => { setMalianData({...malianData, bpTel: e.target.value}); setHasChanges(true); }}
                  className="w-full text-[9px] font-bold border border-slate-300 rounded p-1 bg-white focus:outline-none"
                />
              </div>
            ) : (
              <>
                <p className="uppercase">{malianData.minEdu}</p>
                <p className="text-slate-400 font-extrabold">*************</p>
                <p className="uppercase">{malianData.academy}</p>
                <p className="text-slate-400 font-extrabold">*************</p>
                <p className="uppercase font-black text-slate-900">{malianData.schoolName}</p>
                <p className="text-slate-500 font-semibold">{malianData.bpTel}</p>
              </>
            )}
          </div>
          
          {/* Center Column (Administrative Seal) */}
          <div className="flex flex-col items-center justify-center text-center">
            {/* Visual Seal Container */}
            <div className="w-20 h-20 rounded-full border border-double border-blue-500/30 flex flex-col items-center justify-center text-[6px] font-black uppercase text-blue-600/30 rotate-[-8deg] leading-tight select-none pointer-events-none p-1">
              <span>RÉPUBLIQUE DU MALI</span>
              <div className="w-10 h-[1px] bg-blue-400/30 my-0.5"></div>
              <span className="font-extrabold text-[5px] truncate max-w-[70px]">{malianData.schoolName}</span>
              <div className="w-10 h-[1px] bg-blue-400/30 my-0.5"></div>
              <span>Le Directoire</span>
            </div>
          </div>
          
          {/* Right Column (State Mottos) */}
          <div className="text-right text-[9px] font-bold text-slate-800 space-y-1">
            <p className="uppercase text-slate-900 font-black">RÉPUBLIQUE DU MALI</p>
            <p className="italic text-slate-500 text-[8px]">Un Peuple - Un But - Une Foi</p>
            <p className="text-slate-400 font-extrabold">------------------</p>
            {editMode ? (
              <div className="flex items-center justify-end gap-1 text-[9px] font-bold">
                <span>Année :</span>
                <input 
                  type="text" 
                  value={malianData.schoolYear} 
                  onChange={(e) => { setMalianData({...malianData, schoolYear: e.target.value}); setHasChanges(true); }}
                  className="w-24 text-[9px] font-bold border border-slate-300 rounded p-1 bg-white text-right"
                />
              </div>
            ) : (
              <p className="font-extrabold text-slate-900">Année Scolaire : {malianData.schoolYear}</p>
            )}
          </div>
        </div>

        {/* Big centered title */}
        <div className="text-center my-6">
          <div className="inline-block border-2 border-slate-900 px-8 py-3 bg-slate-50">
            <h1 className="text-lg md:text-xl font-black text-slate-950 uppercase tracking-widest leading-none">
              BULLETIN DE NOTES DU {malianData.term}
            </h1>
          </div>
        </div>

        {/* Student identity details block */}
        <div className="border border-slate-900 grid grid-cols-2 gap-px bg-slate-900 text-xs font-bold uppercase mb-6 shadow-sm">
          
          <div className="bg-white p-3 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase">Nom :</span>
            {editMode ? (
              <input 
                type="text" 
                value={malianData.studentLastName} 
                onChange={(e) => { setMalianData({...malianData, studentLastName: e.target.value}); setHasChanges(true); }}
                className="text-xs font-bold border border-slate-300 rounded p-1 w-2/3 uppercase text-slate-900 bg-white"
              />
            ) : (
              <span className="font-black text-slate-955 text-sm tracking-wide">{malianData.studentLastName}</span>
            )}
          </div>

          <div className="bg-white p-3 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase">Prénoms :</span>
            {editMode ? (
              <input 
                type="text" 
                value={malianData.studentFirstName} 
                onChange={(e) => { setMalianData({...malianData, studentFirstName: e.target.value}); setHasChanges(true); }}
                className="text-xs font-bold border border-slate-300 rounded p-1 w-2/3 text-slate-900 bg-white"
              />
            ) : (
              <span className="font-bold text-slate-800 text-sm">{malianData.studentFirstName}</span>
            )}
          </div>

          <div className="bg-white p-3 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase">Classe :</span>
            {editMode ? (
              <input 
                type="text" 
                value={malianData.studentClass} 
                onChange={(e) => { setMalianData({...malianData, studentClass: e.target.value}); setHasChanges(true); }}
                className="text-xs font-bold border border-slate-300 rounded p-1 w-2/3 text-slate-900 bg-white"
              />
            ) : (
              <span className="font-bold text-slate-900 text-sm">{malianData.studentClass}</span>
            )}
          </div>

          <div className="bg-white p-3 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase">Effectif :</span>
            {editMode ? (
              <input 
                type="number" 
                value={malianData.effectif} 
                onChange={(e) => { setMalianData({...malianData, effectif: parseInt(e.target.value) || 0}); setHasChanges(true); }}
                className="text-xs font-bold border border-slate-300 rounded p-1 w-1/3 text-slate-900 bg-white"
              />
            ) : (
              <span className="font-bold text-slate-800 text-sm">{malianData.effectif} élèves</span>
            )}
          </div>
        </div>

        {/* Grades and Subject Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full border-collapse border-2 border-slate-900 text-xs mb-6 font-medium">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-black text-center border-b-2 border-slate-900">
                <th className="border-r border-slate-900 p-2 text-left uppercase w-1/4">MATIÈRES</th>
                <th className="border-r border-slate-900 p-2 uppercase w-16">MOY. CLASSE</th>
                <th className="border-r border-slate-900 p-2 uppercase w-16">NOTE COMPO/40</th>
                <th className="border-r border-slate-900 p-2 uppercase w-20 bg-slate-200/50">MOY. GÉN.</th>
                <th className="border-r border-slate-900 p-2 uppercase w-12">COEF</th>
                <th className="border-r border-slate-900 p-2 uppercase w-20">MOY. COEF</th>
                <th className="p-2 text-left uppercase">OBSERVATIONS</th>
              </tr>
            </thead>
            <tbody>
              {malianData.subjects.map((s, idx) => (
                <tr key={idx} className="border-b border-slate-900 hover:bg-slate-50/50 transition-colors">
                  
                  {/* Subject Name */}
                  <td className="border-r border-slate-900 p-2 font-black uppercase text-slate-900">{s.name}</td>
                  
                  {/* Class Mark */}
                  <td className="border-r border-slate-900 p-2 text-center">
                    {editMode ? (
                      <input 
                        type="number" 
                        step="0.01" 
                        value={s.moyClasse} 
                        onChange={(e) => handleCellChange(idx, 'moyClasse', e.target.value)}
                        className="w-14 text-center font-bold p-1 border rounded"
                      />
                    ) : (
                      <span className="font-bold text-slate-800">{s.moyClasse.toFixed(2)}</span>
                    )}
                  </td>
                  
                  {/* Composition /40 */}
                  <td className="border-r border-slate-900 p-2 text-center">
                    {editMode ? (
                      <input 
                        type="number" 
                        step="0.01" 
                        value={s.noteCompo} 
                        onChange={(e) => handleCellChange(idx, 'noteCompo', e.target.value)}
                        className="w-14 text-center font-bold p-1 border rounded"
                      />
                    ) : (
                      <span className="font-bold text-slate-800">{s.noteCompo.toFixed(2)}</span>
                    )}
                  </td>
                  
                  {/* General Average */}
                  <td className="border-r border-slate-900 p-2 text-center bg-slate-50 font-black text-slate-900">
                    {s.moyGen.toFixed(2)}
                  </td>
                  
                  {/* Coefficient */}
                  <td className="border-r border-slate-900 p-2 text-center">
                    {editMode ? (
                      <input 
                        type="number" 
                        value={s.coef} 
                        onChange={(e) => handleCellChange(idx, 'coef', e.target.value)}
                        className="w-10 text-center font-bold p-1 border rounded"
                      />
                    ) : (
                      <span className="font-bold text-slate-800">{s.coef}</span>
                    )}
                  </td>
                  
                  {/* Weighted Average */}
                  <td className="border-r border-slate-900 p-2 text-center font-black text-slate-900">
                    {s.moyCoef.toFixed(2)}
                  </td>
                  
                  {/* Observations */}
                  <td className="p-2 italic text-slate-700">
                    {editMode ? (
                      <input 
                        type="text" 
                        value={s.observ} 
                        onChange={(e) => handleCellChange(idx, 'observ', e.target.value)}
                        className="w-full font-medium italic p-1 border rounded text-slate-800"
                        placeholder="Observation..."
                      />
                    ) : (
                      <span>{s.observ}</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {/* Summary Totals Row */}
              <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-900">
                <td className="border-r border-slate-900 p-3 text-right uppercase" colSpan={4}>
                  TOTAUX :
                </td>
                <td className="border-r border-slate-900 p-3 text-center text-sm">
                  {totalCoefficients}
                </td>
                <td className="border-r border-slate-900 p-3 text-center text-sm">
                  {weightedPointsTotal.toFixed(2)}
                </td>
                <td className="p-3 italic text-slate-400 text-[10px]">
                  Fait à Bandiagara par SchoolCore
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Overall Statistics Summary Card */}
        <div className="border border-slate-900 p-4 bg-slate-50/50 mb-6 font-bold text-xs uppercase grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-[10px] text-slate-500 font-black">MOYENNE DU 1er DE LA CLASSE :</span>
              {editMode ? (
                <input 
                  type="number" 
                  step="0.01" 
                  value={malianData.firstAverage} 
                  onChange={(e) => { setMalianData({...malianData, firstAverage: parseFloat(e.target.value) || 0}); setHasChanges(true); }}
                  className="w-20 text-right p-1 border rounded"
                />
              ) : (
                <span className="font-black text-slate-900">{malianData.firstAverage.toFixed(2)}/20</span>
              )}
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-[10px] text-slate-500 font-black">MOYENNE DU DERNIER DE LA CLASSE :</span>
              {editMode ? (
                <input 
                  type="number" 
                  step="0.01" 
                  value={malianData.lastAverage} 
                  onChange={(e) => { setMalianData({...malianData, lastAverage: parseFloat(e.target.value) || 0}); setHasChanges(true); }}
                  className="w-20 text-right p-1 border rounded"
                />
              ) : (
                <span className="font-black text-slate-900">{malianData.lastAverage.toFixed(2)}/20</span>
              )}
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-[10px] text-slate-500 font-black">MOYENNE DE LA CLASSE :</span>
              {editMode ? (
                <input 
                  type="number" 
                  step="0.01" 
                  value={malianData.classAverage} 
                  onChange={(e) => { setMalianData({...malianData, classAverage: parseFloat(e.target.value) || 0}); setHasChanges(true); }}
                  className="w-20 text-right p-1 border rounded"
                />
              ) : (
                <span className="font-black text-slate-900">{malianData.classAverage.toFixed(2)}/20</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-[10px] text-slate-500 font-black">RANG DE L'ÉLÈVE :</span>
              {editMode ? (
                <input 
                  type="text" 
                  value={malianData.rank} 
                  onChange={(e) => { setMalianData({...malianData, rank: e.target.value}); setHasChanges(true); }}
                  className="w-24 text-right p-1 border rounded text-xs font-black uppercase text-blue-600"
                />
              ) : (
                <span className="font-black text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg text-sm">{malianData.rank}</span>
              )}
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-[10px] text-slate-500 font-black text-base font-black">MOYENNE DE L'ÉLÈVE :</span>
              <span className="font-black text-slate-950 text-base underline decoration-double decoration-slate-900">
                {malianData.average.toFixed(2)} / 20
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-[10px] text-slate-500 font-black">DÉCISION DU CONSEIL DES PROFESSEURS :</span>
              {editMode ? (
                <select 
                  value={malianData.decision} 
                  onChange={(e) => { setMalianData({...malianData, decision: e.target.value}); setHasChanges(true); }}
                  className="w-32 p-1 border rounded bg-white text-right font-bold text-xs"
                >
                  <option value="Admis">Admis</option>
                  <option value="Redouble">Redouble</option>
                  <option value="Passe">Passe</option>
                  <option value="Exclu">Exclu</option>
                </select>
              ) : (
                <span className={`font-black tracking-wider uppercase px-2.5 py-1 rounded-lg text-[10px] ${
                  malianData.decision === 'Admis' || malianData.decision === 'Passe'
                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' 
                    : 'bg-rose-50 border border-rose-100 text-rose-700'
                }`}>
                  {malianData.decision}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Signatures & Footer Section */}
        <div className="grid grid-cols-3 gap-6 mt-auto pt-8 items-start border-t border-slate-200">
          
          {/* Parent Signature Block */}
          <div className="text-center">
            <p className="text-[10px] font-black uppercase underline text-slate-900 mb-10">Visa des Parents</p>
            <div className="border-b border-dashed border-slate-300 w-24 mx-auto"></div>
          </div>
          
          {/* Blank column / spacing */}
          <div></div>
          
          {/* Proviseur Signature Block with rubber stamp seal */}
          <div className="text-center relative">
            <div className="space-y-1 text-[10px]">
              {editMode ? (
                <div className="space-y-1 flex flex-col items-center">
                  <input 
                    type="text" 
                    value={malianData.date} 
                    onChange={(e) => { setMalianData({...malianData, date: e.target.value}); setHasChanges(true); }}
                    className="w-full text-center border p-1 rounded font-semibold text-[10px]"
                    placeholder="Bandiagara, le..."
                  />
                  <input 
                    type="text" 
                    value={malianData.proviseur} 
                    onChange={(e) => { setMalianData({...malianData, proviseur: e.target.value}); setHasChanges(true); }}
                    className="w-full text-center border p-1 rounded font-black text-[10px]"
                    placeholder="Nom du Proviseur"
                  />
                </div>
              ) : (
                <>
                  <p className="text-slate-700 font-semibold italic text-[9px]">Fait à Bandiagara, le {malianData.date}</p>
                  <p className="font-black uppercase text-slate-950 underline tracking-widest pt-1">Le Proviseur</p>
                </>
              )}
            </div>

            {/* Space for physical signature and stamp */}
            <div className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-3 h-28 flex flex-col items-center justify-between text-center bg-slate-50/30 print:bg-transparent print:border-slate-400">
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Emplacement Signature & Cachet</span>
              {!editMode && malianData.proviseur && (
                <span className="text-[9px] font-black uppercase text-slate-950 tracking-wider border-t border-dashed border-slate-200 pt-1.5 w-full">{malianData.proviseur}</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ModernTemplate = ({ student, studentGrades, configs, schoolInfo, term, bulletins, onUpdateBulletin }: { 
  student: Student, 
  studentGrades: Grade[], 
  configs: SubjectConfig[], 
  schoolInfo: any, 
  term: string,
  bulletins: Bulletin[],
  onUpdateBulletin?: (data: Partial<Bulletin>) => void
}) => {
  const { subjectAverages, overallAverage } = calculateDetailedAverages(studentGrades, configs);
  const savedBulletin = bulletins.find(b => b.studentId === student.id && b.term === term);
  const averageValue = savedBulletin ? savedBulletin.average : overallAverage;
  const average = averageValue.toFixed(2);
  const numAverage = averageValue;
  const rank = savedBulletin ? savedBulletin.rank : "N/A";
  const observations = savedBulletin ? savedBulletin.comment : "";

  return (
    <div className="bg-white p-12 print:p-0 min-h-[29.7cm] flex flex-col font-sans">
      <div className="flex justify-between items-center mb-12 border-b-2 border-blue-600 pb-8">
        <div>
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg">
              <GraduationCap className="w-8 h-8" />
           </div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">{schoolInfo.name}</h2>
           <p className="text-sm font-bold text-blue-600">{schoolInfo.address}</p>
        </div>
        <div className="text-right">
           <h1 className="text-4xl font-black text-slate-900 uppercase opacity-10">BULLETIN</h1>
           <p className="text-xl font-bold text-slate-400">{term}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-12">
         <div className="col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl font-black text-blue-600 shadow-sm">
               {student.name.charAt(0)}
            </div>
            <div>
               <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Élève</p>
               <h3 className="text-2xl font-black text-slate-900 uppercase">{student.name}</h3>
               <p className="text-sm font-bold text-slate-500">ML : {student.matricule} • {student.class}</p>
            </div>
         </div>
         <div className={`p-6 rounded-3xl border flex flex-col items-center justify-center ${numAverage >= 10 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${numAverage >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>Moyenne</p>
            <p className={`text-4xl font-black ${numAverage >= 10 ? 'text-emerald-700' : 'text-rose-700'}`}>{average}</p>
            <p className={`text-[11px] font-black uppercase ${numAverage >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>RANG: {rank}</p>
         </div>
</div>

      <div className="space-y-4 mb-12 flex-1">
         {subjectAverages.map((g, i) => (
           <div key={i} className="flex items-center gap-6 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
              <div className="flex-1">
                 <div className="flex justify-between items-center mb-2">
                    <h4 className="font-black text-slate-900 uppercase text-sm">{g.name}</h4>
                    <span className="text-xs font-bold text-slate-400">Poids: {g.coef}</span>
                 </div>
                 <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${g.average >= 15 ? 'bg-emerald-500' : g.average >= 10 ? 'bg-orange-500' : 'bg-rose-500'}`} style={{ width: `${(g.average/20)*100}%` }}></div>
                 </div>
              </div>
              <div className="text-right min-w-[60px]">
                 <p className="text-xl font-black text-slate-900">{g.average.toFixed(1)}</p>
                 <p className="text-[10px] font-bold text-slate-400">sur 20</p>
              </div>
           </div>
         ))}
      </div>

      {/* Manual Observation Area */}
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] mb-12">
         <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Observations du Titulaire / Direction</h4>
            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
              Performance : {numAverage >= 15 ? "Excellent" : numAverage >= 12 ? "Très Bien" : numAverage >= 10 ? "Satisfaisant" : "Insuffisant"}
            </div>
         </div>
         <textarea 
            value={observations}
            onChange={(e) => onUpdateBulletin?.({ studentId: student.id, term, comment: e.target.value })}
            placeholder="Éditez l'observation ici pour la sauvegarder..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-sm leading-relaxed text-blue-50 font-medium italic min-h-[100px] focus:ring-1 focus:ring-blue-500/50 outline-none print:bg-transparent print:border-none print:p-0 print:text-slate-900"
         />
         <div className="mt-4 flex flex-wrap gap-4 print:hidden">
            <div className="flex items-center gap-2">
               <button 
                  onClick={() => {
                    const msg = `Résultats de ${student.name} (${term}) : Moyenne ${average}/20, Rang ${rank}. Obs: ${observations}`;
                    if (student.parentPhone) window.open(getWhatsAppLink(student.parentPhone, msg), '_blank');
                    else alert("Numéro du parent non renseigné.");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase transition-all"
               >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
               </button>
               <button 
                  onClick={() => {
                    const subject = `Bulletin ${student.name} - ${term}`;
                    const body = `Bonjour, voici le bilan de ${student.name} :\n- Moyenne : ${average}/20\n- Rang : ${rank}\n- Obs : ${observations}`;
                    if (student.parentEmail) sendEmail(student.parentEmail, subject, body);
                    else alert("Email du parent non renseigné.");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-2xl text-[10px] font-black uppercase transition-all"
               >
                  <Mail className="w-3.5 h-3.5" />
                  Email
               </button>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-bold uppercase text-slate-400">Moy:</span>
               <input 
                  type="number"
                  step="0.01"
                  className="bg-slate-800 border-none text-white text-xs rounded px-2 w-16"
                  value={averageValue}
                  onChange={(e) => onUpdateBulletin?.({ studentId: student.id, term, average: parseFloat(e.target.value) })}
               />
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-bold uppercase text-slate-400">Rang:</span>
               <input 
                  type="text"
                  className="bg-slate-800 border-none text-white text-xs rounded px-2 w-16"
                  value={rank}
                  onChange={(e) => onUpdateBulletin?.({ studentId: student.id, term, rank: e.target.value })}
               />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-100">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
               <ShieldCheck className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Ce document est généré par le système SchoolCore de l'établissement {schoolInfo.name}. Toute altération le rend nul.</p>
         </div>
         <div className="text-right">
            <p className="text-xs font-bold text-slate-900 mb-12 underline uppercase tracking-widest">Le Principal</p>
            <div className="inline-block w-32 border-b border-slate-200"></div>
         </div>
      </div>
    </div>
  );
};

const MinimalTemplate = ({ student, studentGrades, configs, schoolInfo, term, bulletins, onUpdateBulletin }: { 
  student: Student, 
  studentGrades: Grade[], 
  configs: SubjectConfig[], 
  schoolInfo: any, 
  term: string,
  bulletins: Bulletin[],
  onUpdateBulletin?: (data: Partial<Bulletin>) => void
}) => {
  const { subjectAverages, overallAverage, decision } = calculateDetailedAverages(studentGrades, configs);
  const savedBulletin = bulletins.find(b => b.studentId === student.id && b.term === term);
  const averageValue = savedBulletin ? savedBulletin.average : overallAverage;
  const average = averageValue.toFixed(2);
  const rank = savedBulletin ? savedBulletin.rank : "N/A";
  const observations = savedBulletin ? savedBulletin.comment : "";

  return (
    <div className="bg-white p-8 border border-slate-200 min-h-fit font-mono text-[10px]">
      <div className="border-b-2 border-slate-900 pb-4 mb-4 flex justify-between items-end">
        <div>
           <h2 className="font-black text-lg">{schoolInfo.name}</h2>
           <p>{schoolInfo.address}</p>
        </div>
        <div className="text-right">
           <h3 className="font-black">BULLETIN DE NOTES - {term}</h3>
           <p>DATE: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
         <div>
            <p>NOM: {student.name}</p>
            <p>MATRICULE: {student.matricule}</p>
         </div>
         <div className="text-right">
            <p>CLASSE: {student.class}</p>
            <p>MOYENNE: {average}/20</p>
         </div>
      </div>

      <table className="w-full border-t border-slate-900">
        <thead>
          <tr className="border-b border-slate-900">
            <th className="text-left py-2">MATIÈRE</th>
            <th className="text-center py-2">COEFF</th>
            <th className="text-center py-2">NOTE</th>
            <th className="text-right py-2">PONDÉRÉE</th>
          </tr>
        </thead>
        <tbody>
          {subjectAverages.map((g, i) => (
            <tr key={i} className="border-b border-slate-100">
              <td className="py-2">{g.name.toUpperCase()}</td>
              <td className="text-center py-2">{g.coef}</td>
              <td className="text-center py-2">{g.average.toFixed(1)}</td>
              <td className="text-right py-2">{g.points.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 border-t-2 border-slate-900 pt-2 flex justify-between font-black">
         <span>RANG: {rank}</span>
         <span>MOYENNE GÉNÉRALE: {average}/20</span>
      </div>

      <div className="mt-6 pt-4 border-t border-dashed border-slate-300">
         <p className="text-[10px] font-black uppercase mb-1">Observations :</p>
         <textarea 
            value={observations}
            onChange={(e) => onUpdateBulletin?.({ studentId: student.id, term, comment: e.target.value })}
            placeholder="Éditez l'observation..."
            className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-[10px] italic min-h-[60px] outline-none print:bg-transparent print:border-none print:p-0"
         />
         <div className="mt-2 flex gap-4 print:hidden">
            <button 
              onClick={() => {
                const msg = `Bulletin ${student.name} : ${average}/20, Rang ${rank}. Obs: ${observations}`;
                if (student.parentPhone) window.open(getWhatsAppLink(student.parentPhone, msg), '_blank');
              }}
              className="text-[8px] font-black underline hover:text-emerald-600"
            >
              [WHATSAPP]
            </button>
            <button 
              onClick={() => {
                const body = `Bulletin ${student.name}\nMoyenne: ${average}/20\nRang: ${rank}\nObs: ${observations}`;
                if (student.parentEmail) sendEmail(student.parentEmail, `Bulletin ${student.name}`, body);
              }}
              className="text-[8px] font-black underline hover:text-blue-600"
            >
              [EMAIL]
            </button>
            <input 
              type="number"
              step="0.01"
              placeholder="Moy"
              className="border rounded px-1 text-[9px] w-12"
              value={averageValue}
              onChange={(e) => onUpdateBulletin?.({ studentId: student.id, term, average: parseFloat(e.target.value) })}
            />
            <input 
              type="text"
              placeholder="Rang"
              className="border rounded px-1 text-[9px] w-12"
              value={rank}
              onChange={(e) => onUpdateBulletin?.({ studentId: student.id, term, rank: e.target.value })}
            />
         </div>
      </div>
    </div>
  );
};

const StudentProgressionChart = ({ student, bulletins }: { student: Student, bulletins: Bulletin[] }) => {
  const data = [
    { name: '1er Trim', average: bulletins.find(b => b.studentId === student.id && b.term === '1er Trimestre')?.average || 0 },
    { name: '2ème Trim', average: bulletins.find(b => b.studentId === student.id && b.term === '2ème Trimestre')?.average || 0 },
    { name: '3ème Trim', average: bulletins.find(b => b.studentId === student.id && b.term === '3ème Trimestre')?.average || 0 },
  ].filter(d => d.average > 0);

  if (data.length === 0) return (
    <div className="p-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-100">
      Aucune donnée de progression disponible pour cet élève.
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-slate-900 uppercase">Progression Académique</h3>
          <p className="text-xs text-slate-500 font-bold">Évolution des moyennes trimestrielles</p>
        </div>
        <div className={`p-2 rounded-xl ${(data.length > 1 && data[data.length-1].average >= data[data.length-2].average) || data.length === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} domain={[0, 20]} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
            />
            <Line 
              type="monotone" 
              dataKey="average" 
              stroke="#f97316" 
              strokeWidth={4} 
              dot={{ fill: '#f97316', strokeWidth: 2, r: 6, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ProgressionModal = ({ 
  student: initialStudent, 
  students,
  bulletins, 
  onClose,
  schoolId
}: { 
  student: Student, 
  students: Student[],
  bulletins: Bulletin[], 
  onClose: () => void,
  schoolId: string
}) => {
  const student = useMemo(() => {
    return students.find(s => s.id === initialStudent.id) || initialStudent;
  }, [students, initialStudent]);

  const [localNotes, setLocalNotes] = useState(student.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if notes change externally in real-time
  useEffect(() => {
    setLocalNotes(student.notes || '');
  }, [student.notes]);

  const handleSaveNotes = async () => {
    if (!schoolId || !student.id) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateDoc(doc(db, 'schools', schoolId, 'students', student.id), {
        notes: localNotes
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save student notes:", err);
      alert("Erreur lors de l'enregistrement des notes d'observation.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/20">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{student.name}</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analyse de Progression • {student.class}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all border border-slate-100 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <StudentProgressionChart student={student} bulletins={bulletins} />
          
          <div className="grid grid-cols-3 gap-4">
            {['1er Trimestre', '2ème Trimestre', '3ème Trimestre'].map(term => {
              const b = bulletins.find(x => x.studentId === student.id && x.term === term);
              return (
                <div key={term} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{term.split(' ')[0]}</p>
                  <p className={`text-2xl font-black ${b ? 'text-slate-900' : 'text-slate-300'}`}>
                    {b ? b.average.toFixed(2) : '-'}
                  </p>
                  {b && (
                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Rang: {b.rank}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Notes & Observations Partagées */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-orange-500 animate-pulse" />
              Observations & Remarques Partagées
            </h3>
            
            <div className="relative">
              <textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Ex : Difficultés de concentration au premier trimestre, mais nette progression en calcul à la fin du mois. Élève très volontaire..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none h-32 resize-none text-slate-800 leading-relaxed placeholder:text-slate-300"
              />
              
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                {saveSuccess && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald-500 text-[10px] font-black flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg"
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> Enregistré !
                  </motion.span>
                )}
                <button
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Enregistrer
                </button>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-semibold italic">
              * Ces remarques sont synchronisées instantanément entre les comptes du Directeur, des Secrétaires et des Enseignants de l'école.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
// Academic Calculation Utilities
const calculateDetailedAverages = (studentGrades: Grade[], configs: SubjectConfig[]) => {
  // Group grades by subject
  const gradesBySubject: Record<string, number[]> = {};
  studentGrades.forEach(g => {
    if (!gradesBySubject[g.subject]) gradesBySubject[g.subject] = [];
    const normalizedScore = (g.score / g.maxScore) * 20;
    gradesBySubject[g.subject].push(normalizedScore);
  });

  const subjectAverages: any[] = [];
  let weightedPointsTotal = 0;
  let totalCoefficients = 0;

  Object.entries(gradesBySubject).forEach(([subjectName, scores]) => {
    const config = configs.find(c => c.name === subjectName);
    const coeff = config?.coefficient || 1;
    const subjectMean = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    subjectAverages.push({
      name: subjectName,
      average: subjectMean,
      coef: coeff,
      points: subjectMean * coeff,
      category: config?.category || 'Autres'
    });

    weightedPointsTotal += subjectMean * coeff;
    totalCoefficients += coeff;
  });

  const overallAverage = totalCoefficients > 0 ? weightedPointsTotal / totalCoefficients : 0;

  return {
    subjectAverages,
    overallAverage,
    totalCoefficients,
    weightedPointsTotal,
    decision: overallAverage >= 12 ? 'Admis' : overallAverage >= 10 ? 'Admis avec rachat' : 'À jour'
  };
};

const StudentIDCard = ({ student, schoolInfo }: { student: Student, schoolInfo: any }) => {
  const portalUrl = `${window.location.origin}/parent-portal?matricule=${student.matricule}`;
  
  return (
    <div className="w-[380px] h-[220px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col group print:shadow-none print:border-slate-300 print:break-inside-avoid print:mb-8">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors" />
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl p-1 shadow-inner flex items-center justify-center">
            {schoolInfo.logo ? (
              <img src={schoolInfo.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <GraduationCap className="w-6 h-6 text-slate-300" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] font-black uppercase truncate tracking-tight">{schoolInfo.name}</h4>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Carte d'identité scolaire</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-slate-500 font-bold uppercase tabular-nums">ID: {student.id.split('-')[0]}</p>
        </div>
      </div>
      
      {/* Body */}
      <div className="flex-1 p-5 flex gap-6 relative z-10 bg-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
        {/* Photo Slot */}
        <div className="relative group/photo">
          <div className="w-24 h-28 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden shadow-inner group-hover/photo:border-blue-300 transition-colors">
            <UserPlus className="w-8 h-8 text-slate-200" />
            <p className="text-[8px] font-bold text-slate-300 mt-2 uppercase">Photo</p>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2.5">
          <div className="space-y-0.5">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Nom complet de l'élève</p>
            <p className="text-[13px] font-black text-slate-900 uppercase truncate leading-tight">{student.name}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Classe</p>
              <p className="text-xs font-black text-slate-800 tracking-tight">{student.class}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Matricule</p>
              <p className="text-xs font-black text-orange-600 tracking-tighter tabular-nums">{student.matricule}</p>
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Parent / Tuteur</p>
            <p className="text-[9px] font-bold text-slate-600 truncate">{student.parentName || 'Non renseigné'}</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-100 p-2 px-5 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <BadgeCheck className="w-3 h-3 text-emerald-500" />
          <p className="text-[8px] text-slate-500 font-bold uppercase">Officiel SchoolCore</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Validité: 2024-2025</p>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Bamako, Mali</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div 
        className={`p-3 rounded-xl ${color.startsWith('#') ? '' : color}`}
        style={color.startsWith('#') ? { backgroundColor: color } : {}}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
        {change}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

// --- TEACHER PORTAL COMPONENT ---
const TeacherPortal = ({ 
  teacher, 
  schoolInfo, 
  classes, 
  students, 
  schedule, 
  grades,
  attendanceRecords,
  onAddGrade,
  onRemoveGrade,
  onSaveAttendance,
  onLogout
}: { 
  teacher: Teacher; 
  schoolInfo: any;
  classes: SchoolClass[];
  students: Student[];
  schedule: ScheduleEntry[];
  grades: Grade[];
  attendanceRecords: AttendanceRecord[];
  onAddGrade: (grade: Omit<Grade, 'id'>) => void;
  onRemoveGrade: (id: string) => Promise<void>;
  onSaveAttendance: (className: string, date: string, records: Record<string, AttendanceStatus>) => void;
  onLogout: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'schedule' | 'grades' | 'attendance'>(() => {
    const path = location.pathname.substring(1);
    if (['schedule', 'grades', 'attendance'].includes(path)) return path as any;
    return 'schedule';
  });

  // Sync with URL
  useEffect(() => {
    const path = location.pathname.substring(1);
    if (path && ['schedule', 'grades', 'attendance'].includes(path)) {
      setActiveTab(path as any);
    } else if (path === 'dashboard' || path === '') {
      navigate('/schedule', { replace: true });
    }
  }, [location, navigate]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as any);
    navigate(`/${tabId}`);
  };
  const [selectedClassEntry, setSelectedClassEntry] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, AttendanceStatus>>({});
  
  // Pre-populate attendance if records exist for selected class/date
  useEffect(() => {
    if (selectedClassEntry && attendanceDate) {
      const existing = attendanceRecords.filter(r => r.class === selectedClassEntry && r.date === attendanceDate);
      if (existing.length > 0) {
        const records: Record<string, AttendanceStatus> = {};
        existing.forEach(r => {
          records[r.studentId] = r.status;
        });
        setCurrentAttendance(records);
      } else {
        setCurrentAttendance({});
      }
    }
  }, [selectedClassEntry, attendanceDate, attendanceRecords]);
  
  // Filter for teacher specific data
  const teacherSchedule = schedule.filter(s => s.teacherId === teacher.id);
  const teacherClassesNames = Array.from(new Set(teacherSchedule.map(s => s.classId)));
  const teacherClasses = classes.filter(c => teacherClassesNames.includes(c.name));
  
  // Local state for grade entry
  const [gradeSubject, setGradeSubject] = useState(teacher.subject || '');
  const [gradeClass, setGradeClass] = useState('');
  const [gradeTerm, setGradeTerm] = useState('Trimestre 1');
  const [gradeScores, setGradeScores] = useState<Record<string, string>>({});

  const handleSaveGrades = () => {
    Object.entries(gradeScores).forEach(([studentId, score]) => {
      if (score.trim() === '') return;
      onAddGrade({
        studentId,
        subject: gradeSubject,
        score: parseFloat(score),
        maxScore: 20,
        coefficient: 1,
        date: new Date().toISOString().split('T')[0],
        term: gradeTerm
      });
    });
    setGradeScores({});
    alert("Notes enregistrées avec succès !");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Teacher Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: schoolInfo.primaryColor }}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-slate-900 leading-tight uppercase tracking-tight text-sm">
                PORTAIL ENSEIGNANT
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {teacher.name} • {teacher.subject}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {[
            { id: 'schedule', label: 'Horaires', icon: Clock },
            { id: 'grades', label: 'Notes', icon: BookOpen },
            { id: 'attendance', label: 'Appel', icon: CheckSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`py-4 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-orange-600 text-orange-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/schedule" replace />} />
            <Route path="/dashboard" element={<Navigate to="/schedule" replace />} />

            <Route path="/schedule" element={
            <motion.div 
              key="schedule"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Mon Emploi du Temps</h2>
              </div>
              <div className="p-8 overflow-x-auto">
                <div className="grid grid-cols-7 gap-4 min-w-[800px]">
                  <div className="space-y-4">
                    <div className="h-12 flex items-center justify-center font-black text-slate-300 uppercase text-[10px] tracking-widest">Heure</div>
                    {['08h', '09h', '10h', '11h', '12h', '14h', '15h', '16h', '17h'].map(h => (
                      <div key={h} className="h-20 flex items-center justify-center font-bold text-slate-400 text-xs border-t border-slate-50 italic">{h}00</div>
                    ))}
                  </div>
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => (
                    <div key={day} className="space-y-4 flex-1">
                      <div className="h-12 flex items-center justify-center font-black text-slate-900 uppercase text-[10px] tracking-widest bg-slate-50 rounded-2xl">{day}</div>
                      {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(hour => {
                        const cellEntry = teacherSchedule.find(s => s.day === day && s.startTime.startsWith(hour.split(':')[0]));
                        return (
                          <div key={hour} className={`h-20 rounded-2xl border ${cellEntry ? 'bg-orange-600 border-orange-500 shadow-lg shadow-orange-200' : 'bg-slate-50/30 border-slate-100'} p-3 flex flex-col transition-all overflow-hidden`}>
                            {cellEntry && (
                              <div className="text-white">
                                <p className="text-[10px] font-black uppercase tracking-tight leading-none mb-1">{cellEntry.classId}</p>
                                <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">{cellEntry.room}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          } />

          <Route path="/grades" element={
            <motion.div 
              key="grades"
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap gap-6 items-end">
                <div className="space-y-2 flex-1 min-w-[200px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
                  <select 
                    value={gradeClass}
                    onChange={(e) => setGradeClass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Sélectionner une classe</option>
                    {teacherClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2 flex-1 min-w-[200px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Période</label>
                  <select 
                    value={gradeTerm}
                    onChange={(e) => setGradeTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="1er Trimestre">1er Trimestre</option>
                    <option value="2ème Trimestre">2ème Trimestre</option>
                    <option value="3ème Trimestre">3ème Trimestre</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Matière</p>
                  <div className="px-4 py-3 bg-slate-100 rounded-2xl text-sm font-black text-slate-600">
                    {teacher.subject}
                  </div>
                </div>
              </div>

              {gradeClass && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Élève</th>
                        <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Note (/20)</th>
                        <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Dernière Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {students.filter(s => s.class === gradeClass).map(student => {
                        const studentGrades = grades.filter(g => g.studentId === student.id && g.subject === teacher.subject);
                        const lastGrade = studentGrades.length > 0
                          ? [...studentGrades].sort((a, b) => b.id.localeCompare(a.id))[0]
                          : null;
                        return (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500 uppercase">
                                  {student.name.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-700">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex justify-center">
                                <input 
                                  type="number"
                                  min="0"
                                  max="20"
                                  step="0.25"
                                  placeholder="--"
                                  value={gradeScores[student.id] || ''}
                                  onChange={(e) => setGradeScores({...gradeScores, [student.id]: e.target.value})}
                                  className="w-20 text-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                />
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              {lastGrade ? (
                                <div className="inline-flex items-center gap-2 justify-end">
                                  <span className={`font-bold px-3 py-1 rounded-lg text-xs ${lastGrade.score >= 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {lastGrade.score}/20
                                  </span>
                                  <button
                                    onClick={() => onRemoveGrade(lastGrade.id)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all"
                                    title="Supprimer la note"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-300 font-bold italic">Aucune</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="p-8 border-t border-slate-50 flex justify-end">
                    <button 
                      onClick={handleSaveGrades}
                      disabled={Object.keys(gradeScores).length === 0}
                      className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-30 uppercase tracking-widest text-[10px]"
                    >
                      Enregistrer les notes
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          } />

          <Route path="/attendance" element={
            <motion.div 
              key="attendance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 pb-20"
            >
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Registre d'Appel</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Séance / Classe</label>
                    <select 
                      value={selectedClassEntry}
                      onChange={(e) => setSelectedClassEntry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none"
                    >
                      <option value="">Choisir une classe...</option>
                      {teacherClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date</label>
                    <input 
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {selectedClassEntry ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {students.filter(s => s.class === selectedClassEntry).length} Élèves inscrits
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        const records: Record<string, AttendanceStatus> = {};
                        students.filter(s => s.class === selectedClassEntry).forEach(s => records[s.id] = 'Présent');
                        setCurrentAttendance(records);
                      }}
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 px-3 py-2 rounded-xl transition-all border border-emerald-100"
                    >
                      Tout marquer Présent
                    </button>
                  </div>

                  <div className="grid gap-3">
                    {students.filter(s => s.class === selectedClassEntry).map(student => (
                      <motion.div 
                        layout
                        key={student.id} 
                        className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 text-lg border border-slate-100">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{student.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Matricule: {student.matricule || student.id.slice(0, 8)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/50">
                          {[
                            { id: 'Présent', color: 'bg-emerald-500', icon: CheckCircle2 },
                            { id: 'Absent', color: 'bg-red-500', icon: XCircle },
                            { id: 'Retard', color: 'bg-amber-500', icon: Clock },
                            { id: 'Justifié', color: 'bg-blue-500', icon: ShieldCheck }
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setCurrentAttendance({...currentAttendance, [student.id]: item.id as any})}
                              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all gap-1.5 ${
                                currentAttendance[student.id] === item.id
                                  ? `${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-200 scale-105`
                                  : 'text-slate-400 hover:bg-white hover:text-slate-600'
                              }`}
                            >
                              <item.icon className={`w-4 h-4 ${currentAttendance[student.id] === item.id ? 'opacity-100' : 'opacity-50'}`} />
                              <span className="text-[8px] font-black uppercase tracking-tighter">{item.id}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="sticky bottom-6 flex justify-center mt-8">
                    <button 
                      onClick={() => {
                        onSaveAttendance(selectedClassEntry, attendanceDate, currentAttendance);
                        alert("Appel enregistré et synchronisé !");
                      }}
                      className="group flex items-center gap-3 px-12 py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-orange-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 uppercase tracking-[0.2em] text-xs"
                    >
                      <Save className="w-5 h-5 group-hover:animate-bounce" />
                      Valider l'appel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Users className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">Veuillez sélectionner une séance</h3>
                  <p className="text-sm text-slate-400 mt-2">Choisissez une classe pour commencer l'appel du jour.</p>
                </div>
              )}
            </motion.div>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
      </main>
    </div>
  );
};
// --- END TEACHER PORTAL COMPONENT ---

const safeConfirm = (message: string): boolean => {
  try {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      return true;
    }
    return window.confirm(message);
  } catch (e) {
    return true;
  }
};

export default function App() {

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [showParentPortal, setShowParentPortal] = useState(false);
  const [schoolId, setSchoolId] = useState<string>('default-school');
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);

  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('school_core_role');
    return saved as UserRole | null;
  });
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(() => {
    const saved = localStorage.getItem('school_core_plan');
    return (saved as SubscriptionPlan) || 'free';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.substring(1);
    if (!path) {
      const savedRole = localStorage.getItem('school_core_role');
      return savedRole === 'teacher' ? 'schedule' : 'dashboard';
    }
    return path;
  });

  useEffect(() => {
    const match = location.pathname.match(/^\/school\/([^/]+)/);
    if (match && match[1]) {
      setSchoolId(match[1]);
      localStorage.setItem('school_core_id', match[1]);
    }
  }, [location.pathname]);

  // Sync activeTab with URL
  useEffect(() => {
    const path = location.pathname.substring(1).split('/')[0];
    if (path === 'school') return; // Don't sync for public school path
    if (path && path !== activeTab) {
      setActiveTab(path);
    } else if (!path) {
      const defaultTab = userRole === 'teacher' ? 'schedule' : 'dashboard';
      if (activeTab !== defaultTab) {
        setActiveTab(defaultTab);
      }
    }
  }, [location.pathname, userRole]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/${tabId}`);
  };

  const [activeGradesSubTab, setActiveGradesSubTab] = useState<'input' | 'configs' | 'rankings'>('input');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const [allSubscriptionRequests, setAllSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  const [isGeneratingRankings, setIsGeneratingRankings] = useState(false);
  const [subjectConfigs, setSubjectConfigs] = useState<SubjectConfig[]>([
    { id: '1', name: 'Mathématiques', coefficient: 5, category: 'Sciences' },
    { id: '2', name: 'Français', coefficient: 5, category: 'Lettres' },
    { id: '3', name: 'Anglais', coefficient: 3, category: 'Langues' },
    { id: '4', name: 'Histoire-Géo', coefficient: 3, category: 'Lettres' },
    { id: '5', name: 'Physique-Chimie', coefficient: 4, category: 'Sciences' },
    { id: '6', name: 'SVT', coefficient: 3, category: 'Sciences' },
    { id: '7', name: 'EPS', coefficient: 2, category: 'Autres' },
  ]);
  const isGlobalAdmin = currentUser?.email === 'doloemmanuel97@gmail.com';
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'orange' | 'moov' | 'wave' | 'mtn' | 'card' | 'manual' | null>(null);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<'free' | 'premium' | 'pro' | null>(null);
  const [paymentStep, setPaymentStep] = useState<'details' | 'sms' | 'success'>('details');
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [selectedClassForSchedule, setSelectedClassForSchedule] = useState<string>('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingScheduleEntry, setEditingScheduleEntry] = useState<ScheduleEntry | null>(null);
  const [newScheduleClassId, setNewScheduleClassId] = useState('');
  const [newScheduleTeacherId, setNewScheduleTeacherId] = useState('');
  const [newScheduleSubject, setNewScheduleSubject] = useState('');
  const [newScheduleDay, setNewScheduleDay] = useState<ScheduleEntry['day']>('Lundi');
  const [newScheduleStartTime, setNewScheduleStartTime] = useState('08:00');
  const [newScheduleEndTime, setNewScheduleEndTime] = useState('09:00');
  const [newScheduleRoom, setNewScheduleRoom] = useState('');
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [studentListTerm, setStudentListTerm] = useState('1er Trimestre');
  const [studentSortKey, setStudentSortKey] = useState<'name' | 'rank' | 'class' | 'matricule' | 'average'>('name');
  const [studentSortOrder, setStudentSortOrder] = useState<'asc' | 'desc'>('asc');
  const [grades, setGrades] = useState<Grade[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([]);
  const [selectedOnboardingRole, setSelectedOnboardingRole] = useState<UserRole | null>(null);
  
  const [newGradeStudentId, setNewGradeStudentId] = useState('');
  const [newGradeSubject, setNewGradeSubject] = useState('Mathématiques');
  const [selectedClassForGrades, setSelectedClassForGrades] = useState<string>('');
  const [newGradeScore, setNewGradeScore] = useState('');
  const [newGradeMaxScore, setNewGradeMaxScore] = useState('20');
  const [newGradeCoefficient, setNewGradeCoefficient] = useState('1');
  const [newGradeTerm, setNewGradeTerm] = useState('1er Trimestre');

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [showReportCard, setShowReportCard] = useState(false);
  const [showManualReport, setShowManualReport] = useState(false);
  const [isGeneratingBulletinPDF, setIsGeneratingBulletinPDF] = useState(false);

  const handleDownloadBulletinPDF = async () => {
    const container = document.getElementById('bulletins-container');
    if (!container) return;
    
    setIsGeneratingBulletinPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const children = container.querySelectorAll('.bulletin-page');
      
      for (let i = 0; i < children.length; i++) {
        const element = children[i] as HTMLElement;
        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      const fileName = bulkBulletinStudents ? `Bulletins_${newGradeTerm}.pdf` : `Bulletin_${selectedStudentForReport?.name || 'Eleve'}_${newGradeTerm}.pdf`;
      pdf.save(fileName.replace(/\s+/g, '_'));
    } catch (err) {
      console.error('Erreur PDF Bulletin:', err);
      alert('Erreur lors de la génération du PDF. Utilisez la fonction "Imprimer".');
    } finally {
      setIsGeneratingBulletinPDF(false);
    }
  };
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentMatricule, setNewStudentMatricule] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('10ème A');
  const [newStudentParentName, setNewStudentParentName] = useState('');
  const [newStudentParentPhone, setNewStudentParentPhone] = useState('');
  const [newStudentParentEmail, setNewStudentParentEmail] = useState('');
  const [newStudentTotalFees, setNewStudentTotalFees] = useState('50000');
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const [selectedStudentForVault, setSelectedStudentForVault] = useState<Student | null>(null);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [newDocumentCategory, setNewDocumentCategory] = useState<StudentDocument['category']>('Extrait de naissance');
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('Fondamental');
  const [selectedClassForSubjects, setSelectedClassForSubjects] = useState<SchoolClass | null>(null);
  const [newSubjectForClassName, setNewSubjectForClassName] = useState('');
  const [newSubjectForClassCoeff, setNewSubjectForClassCoeff] = useState('2');

  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('Mathématiques');
  const [newTeacherContact, setNewTeacherContact] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherSalary, setNewTeacherSalary] = useState('');

  const [activeStaffTab, setActiveStaffTab] = useState<'teachers' | 'admin'>('teachers');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const adminStaff = useMemo(() => {
    const dbStaff = teachers.filter(t => t.role === 'secretary' || t.role === 'admin');
    if (dbStaff.length > 0) return dbStaff;
    return [
      { id: '1', name: 'Mme. Traoré', staffRole: 'Secrétaire Générale', role: 'secretary', contact: '+223 70 11 22 33' } as any,
      { id: '2', name: 'M. Keita', staffRole: 'Comptable', role: 'secretary', contact: '+223 70 44 55 66' } as any,
    ];
  }, [teachers]);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('');
  const [newAdminContact, setNewAdminContact] = useState('');

  const [manualPaymentRequest, setManualPaymentRequest] = useState<SubscriptionRequest | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [activePaymentRequest, setActivePaymentRequest] = useState<SubscriptionRequest | null>(null);

  // Load existing billing request and school settings
  useEffect(() => {
    if (currentUser && schoolId) {
      const isAdminOrSecretary = isGlobalAdmin || (currentUser && currentUser.uid === schoolId) || userRole === 'admin' || userRole === 'secretary';

      // 1. Pending Request for School (Only for admins/secretaries/owners)
      let unsubscribeAuto = () => {};
      if (isAdminOrSecretary) {
        const q = query(
          collection(db, 'schools', schoolId, 'subscription_requests'),
          where("status", "==", "pending")
        );
        
        unsubscribeAuto = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            setActivePaymentRequest({ id: doc.id, ...doc.data() } as SubscriptionRequest);
          } else {
            setActivePaymentRequest(null);
          }
        }, (error) => handleFirestoreError(error, OperationType.LIST, `schools/${schoolId}/subscription_requests`));
      }

      // 2. School Settings (Plan sync)
      const unsubSchoolSettings = onSnapshot(doc(db, 'schools', schoolId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.subscriptionPlan) {
            setSubscriptionPlan(data.subscriptionPlan);
            localStorage.setItem('school_core_plan', data.subscriptionPlan);
          }
        }
      }, (error) => {
        console.warn("Could not load school settings directly:", error);
      });

      // 3. Global Admin Listener
      let unsubGlobalRequests = () => {};
      if (isGlobalAdmin) {
        const qAdmin = query(
          collectionGroup(db, 'subscription_requests'),
          where("status", "==", "pending")
        );
        unsubGlobalRequests = onSnapshot(qAdmin, (snapshot) => {
          const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubscriptionRequest));
          setAllSubscriptionRequests(requests);
        }, (error) => console.error("Admin fetch error", error));
      }

      return () => {
        unsubscribeAuto();
        unsubSchoolSettings();
        unsubGlobalRequests();
      };
    }
  }, [currentUser, schoolId, isGlobalAdmin, userRole]);

  const [totalFees, setTotalFees] = useState(0);
  const [bulletinTemplate, setBulletinTemplate] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const [bulkBulletinStudents, setBulkBulletinStudents] = useState<Student[] | null>(null);
  
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [selectedStudentForIdCard, setSelectedStudentForIdCard] = useState<Student | null>(null);
  const [selectedStudentForProgression, setSelectedStudentForProgression] = useState<Student | null>(null);
  const [bulkIdCardStudents, setBulkIdCardStudents] = useState<Student[] | null>(null);

  const getSubjectsForClass = useCallback((className: string | undefined) => {
    if (!className) return subjectConfigs;
    const schoolClass = classes.find(c => c.name === className);
    const merged = [...subjectConfigs];
    if (schoolClass?.subjects && schoolClass.subjects.length > 0) {
      schoolClass.subjects.forEach(cs => {
        const idx = merged.findIndex(gs => gs.name === cs.name);
        if (idx !== -1) {
          merged[idx] = cs;
        } else {
          merged.push(cs);
        }
      });
    }
    return merged;
  }, [classes, subjectConfigs]);

  const totalFinancialStats = useMemo(() => {
    const totalExpected = students.reduce((acc, s) => acc + (s.totalFees || 0), 0);
    const totalCollected = transactions.reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    return {
      expected: totalExpected,
      collected: totalCollected,
      debt: totalExpected - totalCollected,
      expenses: totalExpenses,
      profit: totalCollected - totalExpenses
    };
  }, [students, transactions, expenses]);

  const sendEmailNotification = async (to: string, subject: string, html: string) => {
    try {
      await axios.post('/api/send-email', { to, subject, html });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  // Complex Average Calculation Logic
  const getStudentAveragesByTerm = useCallback((studentId: string, term: string) => {
    const termGrades = grades.filter(g => g.studentId === studentId && g.term === term);
    
    // Group grades by subject
    const gradesBySubject: Record<string, number[]> = {};
    termGrades.forEach(g => {
      if (!gradesBySubject[g.subject]) gradesBySubject[g.subject] = [];
      gradesBySubject[g.subject].push((g.score / g.maxScore) * 20); // Normalize to 20
    });

    const subjectAverages: any[] = [];
    let weightedPointsSum = 0;
    let totalCoeffs = 0;

    Object.entries(gradesBySubject).forEach(([subjectName, scores]) => {
      const config = subjectConfigs.find(c => c.name === subjectName);
      const coeff = config?.coefficient || 1;
      const subjectAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      subjectAverages.push({
        name: subjectName,
        average: subjectAvg,
        coef: coeff,
        points: subjectAvg * coeff,
        category: config?.category || 'Autres'
      });

      weightedPointsSum += subjectAvg * coeff;
      totalCoeffs += coeff;
    });

    const overallAverage = totalCoeffs > 0 ? weightedPointsSum / totalCoeffs : 0;

    return {
      subjectAverages,
      overallAverage,
      totalCoeffs,
      weightedPointsSum,
      decision: overallAverage >= 12 ? 'Admis' : overallAverage >= 10 ? 'Admis avec rachat' : 'À jour'
    };
  }, [grades, subjectConfigs]);

  const handleManualPaymentSubmit = async (plan: 'premium' | 'pro', method: 'orange' | 'moov' | 'wave', file?: File) => {
    if (!currentUser || !schoolId) return;

    let proofUrl = "";
    if (file) {
      setIsUploadingProof(true);
      try {
        const formData = new FormData();
        formData.append("proof", file);
        const uploadRes = await axios.post("/api/upload-proof", formData);
        proofUrl = uploadRes.data.url;
      } catch (error) {
        console.error("Upload error", error);
        alert("Erreur lors du téléchargement du justificatif.");
        setIsUploadingProof(false);
        return;
      }
      setIsUploadingProof(false);
    }

    const amount = plan === 'premium' ? (billingCycle === 'monthly' ? 15000 : 135000) : (billingCycle === 'monthly' ? 25000 : 225000);

    try {
      const requestData = {
        schoolId,
        schoolName: schoolInfo.name,
        schoolEmail: currentUser.email,
        schoolPhone: schoolInfo.phone || currentUser.phoneNumber || "N/A",
        plan,
        method,
        proofUrl,
        amount,
        status: 'pending',
        date: new Date().toISOString()
      };

      await addDoc(collection(db, 'schools', schoolId, 'subscription_requests'), requestData);
      
      // Notify Admin
      sendEmailNotification(
        "doloemmanuel97@gmail.com",
        "Nouvelle Demande d'Abonnement - SchoolCore Mali",
        `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #2563eb;">Nouvelle demande d'abonnement</h2>
          <p>L'établissement <strong>${schoolInfo.name}</strong> a soumis une demande pour le plan <strong>${plan.toUpperCase()}</strong>.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>Détails :</strong></p>
          <ul>
            <li><strong>Méthode :</strong> ${method.toUpperCase()}</li>
            <li><strong>Montant :</strong> ${amount.toLocaleString()} FCFA</li>
            <li><strong>Email de contact :</strong> ${currentUser.email}</li>
          </ul>
          ${proofUrl ? `<p><a href="${window.location.origin}${proofUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px;">Voir le justificatif</a></p>` : ""}
          <p style="font-size: 12px; color: #64748b;">Connectez-vous au panneau d'administration pour valider cette demande.</p>
        </div>
        `
      );

      setPaymentSuccess(true);
      setSelectedPlanForPayment(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `schools/${schoolId}/subscription_requests`);
    }
  };

  const handleAddAdmin = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminRole.trim()) return;
    
    const id = Date.now().toString();
    const docId = newAdminEmail.trim() ? newAdminEmail.trim().toLowerCase() : id;
    
    const newStaff: Teacher = {
      id: docId,
      name: newAdminName,
      subject: newAdminRole,
      contact: newAdminContact,
      email: newAdminEmail.trim().toLowerCase() || undefined,
      role: 'secretary',
      staffRole: newAdminRole
    };

    try {
      await setDoc(doc(db, 'schools', schoolId, 'teachers', docId), newStaff);
      setNewAdminName('');
      setNewAdminRole('');
      setNewAdminContact('');
      setNewAdminEmail('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/teachers/${docId}`);
    }
  };

  const handleConfirmSubscription = async (request: SubscriptionRequest) => {
    if (!isGlobalAdmin) return;
    try {
      // 1. Update the request status
      await updateDoc(doc(db, `schools/${request.schoolId}/subscription_requests`, request.id), {
        status: 'confirmed'
      });

      // 2. Update the school's plan
      await setDoc(doc(db, 'schools', request.schoolId), {
        subscriptionPlan: request.plan
      }, { merge: true });

      // 3. Notify the School
      sendEmailNotification(
        request.schoolEmail,
        "Confirmation d'Abonnement - SchoolCore Mali",
        `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #10b981;">Abonnement Confirmé !</h2>
          <p>Félicitations ! Votre demande d'abonnement pour le plan <strong>${request.plan.toUpperCase()}</strong> a été validée avec succès.</p>
          <p>Vous avez désormais accès à toutes les fonctionnalités premium de ce plan.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>Résumé de la demande :</strong></p>
          <ul>
            <li><strong>Établissement :</strong> ${request.schoolName}</li>
            <li><strong>Plan :</strong> ${request.plan.toUpperCase()}</li>
            <li><strong>Date de validation :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
          </ul>
          <p>Merci de votre confiance en SchoolCore Mali.</p>
          <p style="font-size: 12px; color: #64748b;">Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
        `
      );

      alert(`Abonnement ${request.plan} activé pour l'école ${request.schoolId}`);
    } catch (error) {
      console.error("Confirm error", error);
      alert("Erreur lors de la confirmation.");
    }
  };

  const removeAdmin = async (id: string) => {
    if (!schoolId || !safeConfirm("Voulez-vous vraiment supprimer ce membre du personnel ?")) return;
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'teachers', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `schools/${schoolId}/teachers/${id}`);
    }
  };

  const [newPaymentStudentId, setNewPaymentStudentId] = useState('');
  const [newPaymentAmount, setNewPaymentAmount] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'Espèces' | 'Orange Money' | 'Moov Money' | 'Wave Money' | 'Autre'>('Espèces');

  const [newSmsRecipient, setNewSmsRecipient] = useState('');
  const [smsTargetType, setSmsTargetType] = useState<'class' | 'all' | 'manual'>('class');
  const [selectedSmsClass, setSelectedSmsClass] = useState('');
  const [newSmsContent, setNewSmsContent] = useState('');
  const [selectedStudentForSms, setSelectedStudentForSms] = useState<string>('');

  const [billingFilter, setBillingFilter] = useState<'all' | 'month' | 'year' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [analyticsTimeRange, setAnalyticsTimeRange] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');
  const [analyticsClassFilter, setAnalyticsClassFilter] = useState<string>('all');

  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeFinancesTab, setActiveFinancesTab] = useState<'revenues' | 'expenses' | 'profit' | 'debts'>('revenues');
  const [newExpenseCategory, setNewExpenseCategory] = useState<Expense['category']>('Autre');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseDate, setNewExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedExpenseTeacherId, setSelectedExpenseTeacherId] = useState('');
  const [isAnalyzingPerformance, setIsAnalyzingPerformance] = useState(false);
  const [aiAlerts, setAiAlerts] = useState<{ studentId: string, studentName: string, message: string, type: 'warning' | 'info' }[]>([]);
  const [bulletinAIComments, setBulletinAIComments] = useState<Record<string, string>>({});
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);
  const [attendanceClass, setAttendanceClass] = useState('10ème A');
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [attendanceFilterClass, setAttendanceFilterClass] = useState('Toutes');

  const [schoolInfo, setSchoolInfo] = useState<any>({
    name: 'SchoolCore',
    address: 'Avenue du Mali, Bamako',
    phone: '+223 66 49 19 67',
    email: 'contact@schoolcore.ml',
    director: 'M. Traoré',
    motto: 'L\'excellence au service de la réussite.',
    logo: '', 
    primaryColor: '#f97316', // orange-500
    tuitionFees: [
      { id: '1', label: 'Premier Cycle', amount: 45000 },
      { id: '2', label: 'Second Cycle', amount: 60000 },
      { id: '3', label: 'Lycée', amount: 85000 }
    ]
  });

  // Firebase Auth Listener
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await testFirestoreConnection();
        setIsFirestoreConnected(true);
      } catch (err) {
        setIsFirestoreConnected(false);
        console.error("Critical: Firestore connection failed on startup.");
      }
    };
    
    checkConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
      if (user) {
        // Force admin role if super admin email
        if (user.email === 'doloemmanuel97@gmail.com' && user.emailVerified) {
          setSchoolId(user.uid);
          setUserRole('admin');
          localStorage.setItem('school_core_role', 'admin');
          localStorage.setItem('school_core_id', user.uid);
        } else {
          // Check if user is the owner of a school (admin of their own UID)
          // Default behavior for now: use uid as schoolId
          setSchoolId(user.uid);
          
          // TRY to find if this user is a teacher in ANY school or the current schoolId
          // For simplicity in this demo, we check the current schoolId (or the one they linked to)
          const sid = localStorage.getItem('school_core_id') || user.uid;
          setSchoolId(sid);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Firebase Real-time Listeners
  useEffect(() => {
    const isPublicPath = location.pathname.startsWith('/school/');
    if (!isAuthReady) return;
    if (!currentUser && !isPublicPath) return;

    // 1. PUBLIC READ-ONLY DATA (For Landing Page)
    // School Info
    const unsubInfo = onSnapshot(doc(db, 'schools', schoolId, 'config', 'info'), (doc) => {
      if (doc.exists()) setSchoolInfo(doc.data() as any);
    }, (err) => {
      // Quiet fail for public if it doesn't exist yet
      if (!currentUser) console.warn("Public school info not found");
      else handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/config/info`);
    });

    // Classes
    const unsubClasses = onSnapshot(collection(db, 'schools', schoolId, 'classes'), (snapshot) => {
      setClasses(snapshot.docs.map(d => d.data() as SchoolClass));
    }, (err) => {
      if (!currentUser) console.warn("Public classes not found");
      else handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/classes`);
    });

    // 2. AUTHENTICATED PRIVATE DATA
    let unsubStudents = () => {};
    let unsubTeachers = () => {};
    let unsubGrades = () => {};
    let unsubTransactions = () => {};
    let unsubExpenses = () => {};
    let unsubMessages = () => {};
    let unsubSchedule = () => {};
    let unsubAttendance = () => {};
    let unsubExams = () => {};
    let unsubBulletins = () => {};
    let unsubInventory = () => {};
    let unsubInventoryTransactions = () => {};

    const isAdminOrSecretary = isGlobalAdmin || (currentUser && currentUser.uid === schoolId) || userRole === 'admin' || userRole === 'secretary';
    const isTeacherRole = userRole === 'teacher';
    // If they are a teacher, they must have their teacherProfile loaded/synced to be authorized
    const isAuthorized = isAdminOrSecretary || (isTeacherRole && teacherProfile !== null);

    if (currentUser && isAuthorized) {
      // Students
      unsubStudents = onSnapshot(collection(db, 'schools', schoolId, 'students'), (snapshot) => {
        setStudents(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Student)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/students`));

      // Teachers
      unsubTeachers = onSnapshot(collection(db, 'schools', schoolId, 'teachers'), (snapshot) => {
        setTeachers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Teacher)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/teachers`));
      
      // Grades
      unsubGrades = onSnapshot(collection(db, 'schools', schoolId, 'grades'), (snapshot) => {
        setGrades(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Grade)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/grades`));

      // Transactions
      if (isAdminOrSecretary) {
        unsubTransactions = onSnapshot(collection(db, 'schools', schoolId, 'transactions'), (snapshot) => {
          setTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/transactions`));
      }

      // Expenses
      if (isAdminOrSecretary) {
        unsubExpenses = onSnapshot(collection(db, 'schools', schoolId, 'expenses'), (snapshot) => {
          setExpenses(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/expenses`));
      }

      // Messages
      if (isAdminOrSecretary) {
        unsubMessages = onSnapshot(collection(db, 'schools', schoolId, 'messages'), (snapshot) => {
          setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SMSMessage)));
        }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/messages`));
      }

      // Schedule
      unsubSchedule = onSnapshot(collection(db, 'schools', schoolId, 'schedule'), (snapshot) => {
        setSchedule(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ScheduleEntry)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/schedule`));

      // Attendance
      unsubAttendance = onSnapshot(collection(db, 'schools', schoolId, 'attendance'), (snapshot) => {
        setAttendanceRecords(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/attendance`));

      // Exams
      unsubExams = onSnapshot(collection(db, 'schools', schoolId, 'exams'), (snapshot) => {
        setExams(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Exam)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/exams`));

      // Bulletins
      unsubBulletins = onSnapshot(collection(db, 'schools', schoolId, 'bulletins'), (snapshot) => {
        setBulletins(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Bulletin)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/bulletins`));

      // Inventory
      unsubInventory = onSnapshot(collection(db, 'schools', schoolId, 'inventory'), (snapshot) => {
        setInventory(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/inventory`));

      // Inventory Transactions
      unsubInventoryTransactions = onSnapshot(collection(db, 'schools', schoolId, 'inventory_transactions'), (snapshot) => {
         setInventoryTransactions(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryTransaction)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `schools/${schoolId}/inventory_transactions`));
    }

    return () => {
      unsubInfo();
      unsubClasses();
      unsubStudents();
      unsubTeachers();
      unsubGrades();
      unsubTransactions();
      unsubExpenses();
      unsubMessages();
      unsubSchedule();
      unsubAttendance();
      unsubExams();
      unsubBulletins();
      unsubInventory();
      unsubInventoryTransactions();
    };
  }, [isAuthReady, currentUser, schoolId, location.pathname, userRole, teacherProfile]);

  // Auto-detect teacher profile reactively via direct queries and fallback list mapping
  useEffect(() => {
    if (!currentUser || isGlobalAdmin || teacherProfile) return;

    const findAndSyncTeacher = async () => {
      const uidDocRef = doc(db, 'schools', schoolId, 'teachers', currentUser.uid);

      // 1. Try direct fetch by UID first (super fast and standard)
      try {
        const uidDocSnap = await getDoc(uidDocRef);
        if (uidDocSnap.exists()) {
          const profile = uidDocSnap.data() as Teacher;
          setTeacherProfile(profile);
          const solvedRole = profile.role === 'secretary' ? 'secretary' : profile.role === 'admin' ? 'admin' : 'teacher';
          setUserRole(solvedRole);
          localStorage.setItem('school_core_role', solvedRole);
          return;
        }
      } catch (e) {
        console.warn("[Sync Step 1] UID check failed:", e);
      }

      // 2. Try direct fetch by Lowercase Email (another standard path)
      if (currentUser.email) {
        const emailLower = currentUser.email.toLowerCase();
        try {
          const emailDocRef = doc(db, 'schools', schoolId, 'teachers', emailLower);
          const emailDocSnap = await getDoc(emailDocRef);
          if (emailDocSnap.exists()) {
            const profile = emailDocSnap.data() as Teacher;
            setTeacherProfile(profile);
            const solvedRole = profile.role === 'secretary' ? 'secretary' : profile.role === 'admin' ? 'admin' : 'teacher';
            setUserRole(solvedRole);
            localStorage.setItem('school_core_role', solvedRole);

            // Sync with UID for future requests
            await setDoc(uidDocRef, {
              ...profile,
              id: currentUser.uid,
              userId: currentUser.uid
            }, { merge: true });
            return;
          }
        } catch (e) {
          console.warn("[Sync Step 2] Lowercase Email check failed:", e);
        }

        // 3. Fallback: Filtered query by email field (to catch dynamic/timestamps document IDs)
        // This succeeds under our custom rule: (isAuthenticated() && resource.data.email.lower() == request.auth.token.email.lower())
        try {
          const q = query(
            collection(db, 'schools', schoolId, 'teachers'),
            where('email', '==', currentUser.email)
          );
          const qSnap = await getDocs(q);
          if (!qSnap.empty) {
            const profile = qSnap.docs[0].data() as Teacher;
            setTeacherProfile(profile);
            const solvedRole = profile.role === 'secretary' ? 'secretary' : profile.role === 'admin' ? 'admin' : 'teacher';
            setUserRole(solvedRole);
            localStorage.setItem('school_core_role', solvedRole);

            // Sync with both UID and Lowercase Email as document IDs
            await setDoc(uidDocRef, {
              ...profile,
              id: currentUser.uid,
              userId: currentUser.uid
            }, { merge: true });

            await setDoc(doc(db, 'schools', schoolId, 'teachers', emailLower), {
              ...profile,
              id: emailLower,
              userId: currentUser.uid
            }, { merge: true });
            return;
          }
        } catch (e) {
          console.warn("[Sync Step 3] Query by email field failed:", e);
        }
      }

      // 4. In case the teachers are already loaded in memory (e.g. from state)
      if (teachers.length > 0 && currentUser.email) {
        try {
          const foundTeacher = teachers.find(t => t.email?.toLowerCase() === currentUser.email?.toLowerCase());
          if (foundTeacher) {
            setTeacherProfile(foundTeacher);
            const solvedRole = foundTeacher.role === 'secretary' ? 'secretary' : foundTeacher.role === 'admin' ? 'admin' : 'teacher';
            setUserRole(solvedRole);
            localStorage.setItem('school_core_role', solvedRole);

            await setDoc(uidDocRef, {
              ...foundTeacher,
              id: currentUser.uid,
              userId: currentUser.uid
            }, { merge: true });
            return;
          }
        } catch (e) {
          console.warn("[Sync Step 4] Memory cache sync failed:", e);
        }
      }
    };

    findAndSyncTeacher();
  }, [currentUser, isGlobalAdmin, teacherProfile, schoolId, teachers]);

  const handleLoginWithGoogle = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setCurrentUser(result.user);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      console.error("Login attempt failed:", { code: errorCode, message: errorMessage, fullError: error });

      if (errorCode === 'auth/network-request-failed') {
        alert("Une erreur de réseau Firebase est survenue. Vérifiez votre connexion ou les cookies tiers.");
      } else if (
        errorCode === 'auth/popup-closed-by-user' || 
        errorCode === 'auth/cancelled-popup-request' ||
        errorCode === 'auth/user-cancelled'
      ) {
        // Silent fail for user-initiated cancellations
        console.log("User cancelled the login popup.");
      } else {
        alert(`Erreur de connexion: ${errorMessage}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      localStorage.removeItem('school_core_role');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  const handleSaveSettings = async () => {
    if (!currentUser) return;
    setIsSavingSettings(true);
    setSaveSettingsSuccess(false);
    try {
      await setDoc(doc(db, 'schools', schoolId, 'config', 'info'), schoolInfo);
      setSaveSettingsSuccess(true);
      setTimeout(() => setSaveSettingsSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `schools/${schoolId}/config/info`);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const chartData = useMemo(() => {
    if (transactions.length === 0) {
      return [
        { name: 'Jan', amount: 0 },
        { name: 'Fév', amount: 0 },
        { name: 'Mar', amount: 0 },
        { name: 'Avr', amount: 0 },
        { name: 'Mai', amount: 0 },
        { name: 'Juin', amount: 0 },
      ];
    }
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    const data = months.map(m => ({ name: m, amount: 0 }));
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthIndex = date.getMonth();
      data[monthIndex].amount += t.amount;
    });
    return data.slice(0, 6);
  }, [transactions]);

  const attendanceChartData = useMemo(() => {
    const counts = attendanceRecords.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { name: 'Présents', value: counts['Présent'] || 0, color: '#10b981' },
      { name: 'Absents', value: counts['Absent'] || 0, color: '#f43f5e' },
      { name: 'Retards', value: counts['Retard'] || 0, color: '#f59e0b' },
    ];
  }, [attendanceRecords]);

  const revenueByClassData = useMemo(() => {
    const classRevenue = transactions.reduce((acc, t) => {
      const student = students.find(s => s.id === t.studentId);
      const className = student?.class || 'Inconnu';
      acc[className] = (acc[className] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(classRevenue).map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, students]);

  const studentDistributionData = useMemo(() => {
    if (students.length === 0) {
      return classes.map(c => ({ name: c.name, effectif: 0 }));
    }
    const distribution = students.reduce((acc, s) => {
      const className = s.class || 'Inconnu';
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(distribution).map(([name, effectif]) => ({ name, effectif }));
  }, [students, classes]);

  const rankedStudents = useMemo(() => {
    const classGroups: Record<string, any[]> = {};
    
    // Group and calculate averages
    students.forEach(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id && g.term === studentListTerm);
      const { overallAverage } = calculateDetailedAverages(studentGrades, subjectConfigs);
      
      if (!classGroups[student.class]) classGroups[student.class] = [];
      classGroups[student.class].push({ ...student, average: overallAverage });
    });

    const results: any[] = [];
    Object.keys(classGroups).forEach(className => {
      const group = classGroups[className];
      const sorted = [...group].sort((a, b) => b.average - a.average);
      sorted.forEach((s, i) => {
        results.push({ ...s, rank: s.average > 0 ? i + 1 : '-' });
      });
    });

    return results;
  }, [students, grades, studentListTerm, subjectConfigs]);

  const filteredStudents = useMemo(() => {
    let result = [...rankedStudents];
    
    if (studentSearchQuery.trim()) {
      const query = studentSearchQuery.toLowerCase().trim();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) || 
        (s.matricule && s.matricule.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      let valA: any = a[studentSortKey as keyof typeof a];
      let valB: any = b[studentSortKey as keyof typeof b];

      if (studentSortKey === 'rank') {
        const rA = a.rank === '-' ? 9999 : a.rank;
        const rB = b.rank === '-' ? 9999 : b.rank;
        return studentSortOrder === 'asc' ? rA - rB : rB - rA;
      }

      if (studentSortKey === 'average') {
        return studentSortOrder === 'asc' ? a.average - b.average : b.average - a.average;
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return studentSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return studentSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rankedStudents, studentSearchQuery, studentSortKey, studentSortOrder]);

  const gradesBySubjectData = useMemo(() => {
    if (grades.length === 0) {
      return [
        { name: 'Maths', average: 14.5 },
        { name: 'Français', average: 12.8 },
        { name: 'Physique', average: 13.2 },
        { name: 'SVT', average: 15.1 },
        { name: 'Histoire', average: 11.5 },
      ];
    }
    const subjectGrades: Record<string, { total: number; count: number }> = {};
    grades.forEach(grade => {
      if (!subjectGrades[grade.subject]) {
        subjectGrades[grade.subject] = { total: 0, count: 0 };
      }
      const normalizedScore = (grade.score / grade.maxScore) * 20;
      subjectGrades[grade.subject].total += normalizedScore;
      subjectGrades[grade.subject].count += 1;
    });

    return Object.keys(subjectGrades).map(subject => ({
      name: subject,
      average: parseFloat((subjectGrades[subject].total / subjectGrades[subject].count).toFixed(2))
    })).sort((a, b) => b.average - a.average);
  }, [grades]);

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !currentUser) return;

    const limits = { free: 50, premium: 300, pro: Infinity };
    if (students.length >= limits[subscriptionPlan]) {
      alert("Vous avez atteint la limite de votre plan. Veuillez passer au plan supérieur.");
      return;
    }

    const id = Date.now().toString();
    const matricule = newStudentMatricule.trim() || `SC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newStudent: Student = {
      id,
      name: newStudentName,
      class: newStudentClass,
      dateAdded: new Date().toISOString().split('T')[0],
      parentName: newStudentParentName,
      parentPhone: newStudentParentPhone,
      parentEmail: newStudentParentEmail,
      totalFees: parseFloat(newStudentTotalFees) || 0,
      matricule
    };

    try {
      await setDoc(doc(db, 'schools', schoolId, 'students', id), newStudent);
      setNewStudentName('');
      setNewStudentMatricule('');
      setNewStudentParentName('');
      setNewStudentParentPhone('');
      setNewStudentParentEmail('');
      setNewStudentTotalFees('50000');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/students/${id}`);
    }
  };

  const handleSendParentSMS = (student: Student) => {
    if (subscriptionPlan === 'free') {
      alert("La fonctionnalité SMS est réservée aux plans Premium et Pro. Veuillez mettre à jour votre abonnement.");
      return;
    }

    if (!student.parentPhone) {
      alert("Cet élève n'a pas de numéro de téléphone parent enregistré.");
      return;
    }

    const message = `Bonjour, vous avez une échéance de paiement en attente pour l'élève ${student.name}. Merci.`;
    
    // Simulate SMS sending
    console.log(`[SMS SIMULATION] To: ${student.parentPhone} | Message: ${message}`);
    alert(`SMS envoyé à ${student.parentName || 'le parent'} (${student.parentPhone}) :\n\n"${message}"`);
  };

  const removeStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'students', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `schools/${schoolId}/students/${id}`);
    }
  };

  const handleAddDocumentToStudent = async (studentId: string, name: string, url: string, category: StudentDocument['category']) => {
    if (!schoolId) return;
    setIsUploadingDocument(true);
    try {
      const newDoc: StudentDocument = {
        id: Date.now().toString(),
        name,
        url,
        category,
        dateAdded: new Date().toLocaleDateString('fr-FR'),
        size: (url.length * 0.75 / 1024).toFixed(1) + ' KB'
      };

      await updateDoc(doc(db, 'schools', schoolId, 'students', studentId), {
        documents: arrayUnion(newDoc)
      });
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Erreur lors de l'ajout du document.");
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const handleRemoveDocument = async (studentId: string, document: StudentDocument) => {
    if (!schoolId || !safeConfirm("Voulez-vous vraiment supprimer ce document ?")) return;
    try {
      await updateDoc(doc(db, 'schools', schoolId, 'students', studentId), {
        documents: arrayRemove(document)
      });
    } catch (error) {
      console.error("Error removing document:", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleAddClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !currentUser) return;

    const id = Date.now().toString();
    const newClass: SchoolClass = {
      id,
      name: newClassName,
      gradeLevel: newClassGrade,
    };

    try {
      await setDoc(doc(db, 'schools', schoolId, 'classes', id), newClass);
      setNewClassName('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/classes/${id}`);
    }
  };

  const removeClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'classes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `schools/${schoolId}/classes/${id}`);
    }
  };

  const handleAddSubjectToClass = async (classId: string) => {
    if (!newSubjectForClassName.trim() || !currentUser) return;
    
    const targetClass = classes.find(c => c.id === classId);
    if (!targetClass) return;

    const newSubject: SubjectConfig = {
      id: Date.now().toString(),
      name: newSubjectForClassName,
      coefficient: parseFloat(newSubjectForClassCoeff) || 1,
      category: 'Autres'
    };

    const updatedSubjects = [...(targetClass.subjects || []), newSubject];

    try {
      await updateDoc(doc(db, 'schools', schoolId, 'classes', classId), {
        subjects: updatedSubjects
      });
      setNewSubjectForClassName('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/classes/${classId}`);
    }
  };

  const removeSubjectFromClass = async (classId: string, subjectId: string) => {
    const targetClass = classes.find(c => c.id === classId);
    if (!targetClass) return;

    const updatedSubjects = (targetClass.subjects || []).filter(s => s.id !== subjectId);

    try {
      await updateDoc(doc(db, 'schools', schoolId, 'classes', classId), {
        subjects: updatedSubjects
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/classes/${classId}`);
    }
  };

  // Schedule Management
  const checkScheduleConflicts = (newEntry: Partial<ScheduleEntry>, currentId?: string) => {
    const conflicts: string[] = [];
    const others = schedule.filter(s => s.id !== currentId && s.day === newEntry.day);
    
    others.forEach(s => {
      const isOverlapping = (newEntry.startTime! < s.endTime) && (newEntry.endTime! > s.startTime);
      if (isOverlapping) {
        const teacherName = teachers.find(t => t.id === s.teacherId)?.name || 'Inconnu';
        if (s.teacherId === newEntry.teacherId) {
          conflicts.push(`Conflit d'enseignant : ${teacherName} est déjà occupé avec la classe ${s.classId}.`);
        }
        if (s.room === newEntry.room && s.room !== 'Extérieur' && s.room !== '') {
          conflicts.push(`Conflit de salle : La salle "${s.room}" est déjà occupée par la classe ${s.classId}.`);
        }
        if (s.classId === newEntry.classId) {
          conflicts.push(`Conflit de classe : La classe ${s.classId} a déjà un cours (${s.subject}).`);
        }
      }
    });

    return conflicts;
  };

  const handleSaveScheduleEntry = async () => {
    if (!newScheduleClassId || !newScheduleTeacherId || !newScheduleSubject || !newScheduleStartTime || !newScheduleEndTime) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (newScheduleStartTime >= newScheduleEndTime) {
      alert("L'heure de début doit être avant l'heure de fin.");
      return;
    }

    const entryData: Partial<ScheduleEntry> = {
      classId: newScheduleClassId,
      teacherId: newScheduleTeacherId,
      subject: newScheduleSubject,
      day: newScheduleDay,
      startTime: newScheduleStartTime,
      endTime: newScheduleEndTime,
      room: newScheduleRoom
    };

    const conflicts = checkScheduleConflicts(entryData, editingScheduleEntry?.id);
    if (conflicts.length > 0) {
      alert("Impossible d'enregistrer le cours :\n\n" + conflicts.join('\n'));
      return;
    }

    setIsSavingSchedule(true);
    try {
      const entryId = editingScheduleEntry?.id || `SCH-${Date.now()}`;
      await setDoc(doc(db, 'schools', schoolId, 'schedule', entryId), {
        ...entryData,
        id: entryId
      });
      setShowScheduleModal(false);
      setEditingScheduleEntry(null);
      // Reset form
      setNewScheduleSubject('');
      setNewScheduleRoom('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `schools/${schoolId}/schedule`);
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleDeleteScheduleEntry = async (entryId: string) => {
    if (!safeConfirm("Voulez-vous vraiment supprimer ce cours ?")) return;
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'schedule', entryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `schools/${schoolId}/schedule/${entryId}`);
    }
  };

  const handleAddTeacher = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherSubject.trim() || !currentUser) return;

    const id = Date.now().toString();
    const docId = newTeacherEmail.trim() ? newTeacherEmail.trim().toLowerCase() : id;
    const newTeacher: Teacher = {
      id: docId,
      name: newTeacherName,
      subject: newTeacherSubject,
      contact: newTeacherContact,
      email: newTeacherEmail,
      salary: newTeacherSalary ? parseFloat(newTeacherSalary) : undefined
    };

    try {
      await setDoc(doc(db, 'schools', schoolId, 'teachers', docId), newTeacher);
      setNewTeacherName('');
      setNewTeacherSubject('Mathématiques');
      setNewTeacherContact('');
      setNewTeacherEmail('');
      setNewTeacherSalary('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/teachers/${docId}`);
    }
  };

  const removeTeacher = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'teachers', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `schools/${schoolId}/teachers/${id}`);
    }
  };

  const handleAddTransaction = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPaymentStudentId || !newPaymentAmount || !currentUser) return;

    const student = students.find(s => s.id === newPaymentStudentId);
    if (!student) return;

    const id = Date.now().toString();
    const newTransaction: Transaction = {
      id,
      studentId: newPaymentStudentId,
      studentName: student.name,
      amount: parseFloat(newPaymentAmount),
      method: newPaymentMethod,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      await setDoc(doc(db, 'schools', schoolId, 'transactions', id), newTransaction);
      setNewPaymentAmount('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/transactions/${id}`);
    }
  };

  const handleAddExpense = async (e: FormEvent) => {
    e.preventDefault();
    if (!newExpenseCategory || !newExpenseAmount || !currentUser) return;
    
    const id = Date.now().toString();
    const newExpense: Expense = {
      id,
      category: newExpenseCategory,
      amount: parseFloat(newExpenseAmount),
      description: newExpenseDescription,
      date: newExpenseDate
    };

    try {
      await setDoc(doc(db, 'schools', schoolId, 'expenses', id), newExpense);
       setNewExpenseAmount('');
       setNewExpenseDescription('');
       setSelectedExpenseTeacherId('');
       alert("Dépense enregistrée !");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/expenses/${id}`);
    }
  };

  const generateAIComment = async (student: Student, termGrades: Grade[]) => {
    if (!student || termGrades.length === 0) return;
    setIsGeneratingComment(true);
    try {
      const gradesSummary = termGrades.map(g => `${g.subject}: ${g.score}/${g.maxScore}`).join(', ');
      const prompt = `Agis comme un directeur d'école bienveillant. Rédige un commentaire de bulletin court (MAX 150 caractères) pour l'élève ${student.name} basé sur ses résultats : ${gradesSummary}. Sois précis sur les forces et les points d'amélioration. Réponse en Français uniquement.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const text = response.text || "Continuez vos efforts.";
      setBulletinAIComments(prev => ({ ...prev, [student.id]: text }));
    } catch (err) {
      console.error("Gemini Error:", err);
      setBulletinAIComments(prev => ({ ...prev, [student.id]: "Continuez vos efforts pour progresser davantage." }));
    } finally {
      setIsGeneratingComment(false);
    }
  };

  const runPerformanceAnalysis = async () => {
    if (students.length === 0 || grades.length === 0) return;
    setIsAnalyzingPerformance(true);
    try {
      // Prepare a summary of recent performance dips
      const recentGrades = grades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50);
      const dataString = recentGrades.map(g => {
        const student = students.find(s => s.id === g.studentId);
        return `${student?.name} (${g.subject}): ${g.score}/${g.maxScore}`;
      }).join('|');

      const prompt = `Analyse ces résultats récents d'élèves : ${dataString}. Identifie 3 alertes prioritaires pour le directeur (ex: chute brutale de notes, difficultés persistantes). Formate chaque alerte ainsi: "NOM DE L'ELEVE: MESSAGE COURT". Max 3 alertes.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const text = response.text || "";
      const lines = text.split('\n').filter(l => l.includes(':'));
      
      const newAlerts = lines.map(line => {
        const [name, message] = line.split(':');
        return {
          studentId: 'alert',
          studentName: name.trim(),
          message: message.trim(),
          type: 'warning' as const
        };
      });
      
      setAiAlerts(newAlerts);
    } catch (err) {
      console.error("Analysis Error:", err);
    } finally {
      setIsAnalyzingPerformance(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!safeConfirm("Voulez-vous supprimer cette dépense ?")) return;
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'expenses', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `schools/${schoolId}/expenses/${id}`);
    }
  };

  const handleConfirmPayment = () => {
    if (paymentStep === 'details') {
      if ((selectedPaymentMethod === 'orange' || selectedPaymentMethod === 'moov' || selectedPaymentMethod === 'mtn') && !userPhoneNumber.trim()) {
        return;
      }
      setIsPaymentProcessing(true);
      // Simulate sending SMS
      setTimeout(() => {
        setIsPaymentProcessing(false);
        setPaymentStep('sms');
      }, 2000);
    } else if (paymentStep === 'sms') {
      if (!smsCode.trim()) return;
      setIsPaymentProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        setIsPaymentProcessing(false);
        setPaymentStep('success');
        setPaymentSuccess(true);
        
        // Update subscription plan in state and localStorage
        if (selectedPlanForPayment) {
          setSubscriptionPlan(selectedPlanForPayment);
          localStorage.setItem('school_core_plan', selectedPlanForPayment);
        }

        setTimeout(() => {
          setPaymentSuccess(false);
          setSelectedPaymentMethod(null);
          setPaymentStep('details');
          setSmsCode('');
          setUserPhoneNumber('');
          setSelectedPlanForPayment(null);
        }, 4000);
      }, 2500);
    }
  };

  const handleSendSMS = (e: FormEvent) => {
    e.preventDefault();
    if (!newSmsContent.trim()) return;
    if (smsTargetType === 'manual' && !newSmsRecipient.trim()) return;
    if (smsTargetType === 'class' && !selectedSmsClass) return;

    // Subscription Check
    if (subscriptionPlan === 'free') {
      alert("L'envoi de SMS est réservé aux plans Premium et Pro.");
      return;
    }

    let recipientLabel = "";
    let targetStudents: Student[] = [];

    if (smsTargetType === 'all') {
      recipientLabel = "Tous les Parents";
      targetStudents = students;
    } else if (smsTargetType === 'class') {
      recipientLabel = `Parents de ${selectedSmsClass}`;
      targetStudents = students.filter(s => s.class === selectedSmsClass);
    } else {
      recipientLabel = newSmsRecipient;
    }

    const newMessage: SMSMessage = {
      id: Date.now().toString(),
      recipient: recipientLabel,
      content: newSmsContent,
      date: new Date().toISOString().split('T')[0],
      status: 'Envoyé',
    };

    // Simulation of actual sending logic for each student
    if (targetStudents.length > 0) {
      console.log(`[BULK SMS] Sending to ${targetStudents.length} recipients for ${recipientLabel}`);
      targetStudents.forEach(s => {
        if (s.parentPhone) {
          console.log(`[SMS SIMULATION] To: ${s.parentPhone} | Msg: ${newSmsContent}`);
        }
      });
      alert(`Message envoyé avec succès à ${targetStudents.length} parents de ${recipientLabel}.`);
    } else if (smsTargetType === 'manual') {
      alert(`Message envoyé à ${newSmsRecipient}.`);
    }

    setMessages([newMessage, ...messages]);
    setNewSmsRecipient('');
    setNewSmsContent('');
    setSelectedSmsClass('');
  };

  const handleSaveAttendance = (e: FormEvent) => {
    e.preventDefault();
    const classStudents = students.filter(s => s.class === attendanceClass);
    
    const newRecords: AttendanceRecord[] = classStudents.map(student => ({
      id: `${Date.now()}-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      class: attendanceClass,
      date: attendanceDate,
      status: currentAttendance[student.id] || 'Présent'
    }));

    // Automatic SMS Notifications for Absences
    if (subscriptionPlan !== 'free') {
      const absences = newRecords.filter(r => r.status === 'Absent');
      if (absences.length > 0) {
        const newSms: SMSMessage[] = absences.map(abs => ({
          id: `sms-${abs.id}`,
          recipient: `Parents de ${abs.studentName}`,
          content: `Alerte Absence: Votre enfant ${abs.studentName} a été marqué absent aujourd'hui (${abs.date}) en classe de ${abs.class}.`,
          date: new Date().toISOString().split('T')[0],
          status: 'Envoyé'
        }));
        setMessages(prev => [...newSms, ...prev]);
        // We'll show a combined message in the final alert
      }
    }

    // Remove existing records for the same class and date to avoid duplicates
    const filteredRecords = attendanceRecords.filter(
      r => !(r.class === attendanceClass && r.date === attendanceDate)
    );

    setAttendanceRecords([...newRecords, ...filteredRecords]);
    
    const absenceCount = newRecords.filter(r => r.status === 'Absent').length;
    const smsInfo = (subscriptionPlan !== 'free' && absenceCount > 0) 
      ? `\n\n${absenceCount} notifications SMS envoyées aux parents.`
      : (subscriptionPlan === 'free' && absenceCount > 0)
      ? `\n\nNote: Les SMS n'ont pas été envoyés (Plan Free).`
      : '';

    alert(`Présences enregistrées pour la classe ${attendanceClass} le ${attendanceDate}.${smsInfo}`);
  };

  const handleLogin = (role: UserRole) => {
    if (isLoggingIn) return;
    if (!currentUser) {
      handleLoginWithGoogle();
      return;
    }

    // Security: Only the super admin can access the admin role
    // and the super admin is ALWAYS recognized as admin
    if (currentUser.email === 'doloemmanuel97@gmail.com') {
      if (currentUser.emailVerified) {
        setUserRole('admin');
        localStorage.setItem('school_core_role', 'admin');
      } else {
        alert("Veuillez vérifier votre email Google pour accéder aux privilèges administrateur.");
      }
      return;
    }

    // For other users (if any), prevent unauthorized admin role selection
    if (role === 'admin') {
      alert("Accès refusé. Seul l'administrateur principal peut accéder à ce rôle.");
      return;
    }

    // Use direct state update for faster response
    setUserRole(role);
    localStorage.setItem('school_core_role', role);
  };

  // Auto-transition after successful login if a role was already selected
  useEffect(() => {
    if (currentUser && selectedOnboardingRole && !userRole) {
      setUserRole(selectedOnboardingRole);
      localStorage.setItem('school_core_role', selectedOnboardingRole);
    }
  }, [currentUser, selectedOnboardingRole, userRole]);

  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);
  const [selectedStudentForBulletin, setSelectedStudentForBulletin] = useState<Student | null>(null);
  const [selectedBulletinStyle, setSelectedBulletinStyle] = useState<'classic' | 'modern' | 'simple' | 'premium'>('classic');
  const [bulletinTerm, setBulletinTerm] = useState('1er Trimestre');
  const [isGeneratingBulletin, setIsGeneratingBulletin] = useState(false);
  const [generatedBulletin, setGeneratedBulletin] = useState<any>(null);

  const calculateStudentStats = (student: Student, term: string) => {
    const studentGrades = grades.filter(g => g.studentId === student.id && g.term === term);
    if (studentGrades.length === 0) return null;

    const subjects: Record<string, { total: number; count: number; coef: number }> = {};
    studentGrades.forEach(g => {
      if (!subjects[g.subject]) subjects[g.subject] = { total: 0, count: 0, coef: g.coefficient || 1 };
      subjects[g.subject].total += (g.score / g.maxScore) * 20;
      subjects[g.subject].count += 1;
    });

    const subjectAverages = Object.keys(subjects).map(name => ({
      name,
      average: subjects[name].total / subjects[name].count,
      coef: subjects[name].coef
    }));

    const totalPoints = subjectAverages.reduce((acc, s) => acc + (s.average * s.coef), 0);
    const totalCoef = subjectAverages.reduce((acc, s) => acc + s.coef, 0);
    const overallAverage = totalPoints / totalCoef;

    // Rank calculation
    const classStudents = students.filter(s => s.class === student.class);
    const classAverages = classStudents.map(s => {
      const sGrades = grades.filter(g => g.studentId === s.id && g.term === term);
      if (sGrades.length === 0) return 0;
      
      const sSubjects: Record<string, { total: number; count: number; coef: number }> = {};
      sGrades.forEach(g => {
        if (!sSubjects[g.subject]) sSubjects[g.subject] = { total: 0, count: 0, coef: g.coefficient || 1 };
        sSubjects[g.subject].total += (g.score / g.maxScore) * 20;
        sSubjects[g.subject].count += 1;
      });

      const sSubAverages = Object.keys(sSubjects).map(name => ({
        average: sSubjects[name].total / sSubjects[name].count,
        coef: sSubjects[name].coef
      }));

      const sTotalPoints = sSubAverages.reduce((acc, sub) => acc + (sub.average * sub.coef), 0);
      const sTotalCoef = sSubAverages.reduce((acc, sub) => acc + sub.coef, 0);
      return sTotalPoints / sTotalCoef;
    }).sort((a, b) => b - a);

    const rank = classAverages.indexOf(overallAverage) + 1;

    return {
      subjectAverages,
      overallAverage,
      rank,
      totalStudents: classStudents.length,
      decision: overallAverage >= 10 ? 'Admis' : 'Redouble'
    };
  };

  const handleGenerateBulletin = async () => {
    if (!selectedStudentForBulletin) return;
    
    setIsGeneratingBulletin(true);
    const stats = calculateStudentStats(selectedStudentForBulletin, bulletinTerm);
    
    if (!stats) {
      alert("Aucune note trouvée pour cet élève sur ce trimestre.");
      setIsGeneratingBulletin(false);
      return;
    }

    try {
      const prompt = `Génère une appréciation pédagogique ultra-personnalisée pour un bulletin scolaire au Mali.
      
      ÉLÈVE: ${selectedStudentForBulletin.name}
      MOYENNE: ${stats.overallAverage.toFixed(2)}/20
      RANG: ${stats.rank}/${stats.totalStudents}
      MATIÈRES: ${stats.subjectAverages.map(s => `${s.name}: ${s.average.toFixed(2)}/20`).join(', ')}
      
      CONSTRUCTIONS DES PHRASES :
      - Utilise le prénom de l'élève.
      - Si la moyenne est > 14, sois élogieux mais encourage la constance.
      - Si la moyenne est entre 10 et 14, encourage les efforts et identifie une matière faible.
      - Si la moyenne est < 10, sois ferme mais bienveillant, propose un soutien.
      - Ton : Directeur d'école malienne, professionnel et paternel.
      
      RÉPONSE: Un paragraphe unique de 35 à 45 mots en français.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const aiComment = response.text || "Travail à suivre de près.";
      
      setGeneratedBulletin({
        ...stats,
        student: selectedStudentForBulletin,
        term: bulletinTerm,
        aiComment,
        date: new Date().toLocaleDateString('fr-FR')
      });
    } catch (error) {
      console.error("Bulletin AI Error:", error);
      setGeneratedBulletin({
        ...stats,
        student: selectedStudentForBulletin,
        term: bulletinTerm,
        aiComment: stats.overallAverage >= 12 ? "Bon travail, continuez ainsi." : "Des efforts sont attendus au prochain trimestre.",
        date: new Date().toLocaleDateString('fr-FR')
      });
    } finally {
      setIsGeneratingBulletin(false);
    }
  };

  const [aiChatMessages, setAiChatMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Bonjour ! Je suis l'assistant SchoolCore. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [isAiChatLoading, setIsAiChatLoading] = useState(false);
  const [performanceAlerts, setPerformanceAlerts] = useState<{id: string, name: string, subject: string, drop: number, message: string}[]>([]);

  const generatePerformanceInsights = useCallback(() => {
    const alerts: {id: string, name: string, subject: string, drop: number, message: string}[] = [];
    
    students.forEach(student => {
      const studentGrades = grades.filter(g => g.studentId === student.id);
      const gradesBySubject: Record<string, Grade[]> = {};
      
      studentGrades.forEach(g => {
        if (!gradesBySubject[g.subject]) gradesBySubject[g.subject] = [];
        gradesBySubject[g.subject].push(g);
      });

      Object.entries(gradesBySubject).forEach(([subject, sGrades]) => {
        if (sGrades.length >= 2) {
          // Sort by date or id (assuming id/date sequentiality)
          const sortedGrades = [...sGrades].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const current = (sortedGrades[0].score / sortedGrades[0].maxScore) * 20;
          const previous = (sortedGrades[1].score / sortedGrades[1].maxScore) * 20;
          const drop = previous - current;

          if (drop >= 3) { // Threshold for "significant alert"
            alerts.push({
              id: student.id,
              name: student.name,
              subject,
              drop,
              message: `Attention, l'élève ${student.name} a chuté de ${drop.toFixed(1)} points en ${subject} ce mois-ci, une intervention est recommandée.`
            });
          }
        }
      });
    });
    
    setPerformanceAlerts(alerts.slice(0, 5)); // Keep top 5 latest alerts
  }, [students, grades]);

  useEffect(() => {
    if (students.length > 0 && grades.length > 0) {
      generatePerformanceInsights();
    }
  }, [students, grades, generatePerformanceInsights]);

  const handleSendAiChatMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim() || isAiChatLoading) return;

    const userMsg = aiChatInput.trim();
    setAiChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiChatInput('');
    setIsAiChatLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Clé API manquante");
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Tu es l'assistant intelligent expert de SchoolCore, la plateforme de gestion scolaire leader au Mali. 
          
          DIRECTIVES :
          - Tu DOIS répondre à TOUTES les questions de l'utilisateur de manière constructive.
          - Si la question est liée à la gestion scolaire, sois technique et précis.
          - Si la question est hors-sujet, réponds-y courtoisement puis fais un lien subtil avec la gestion scolaire ou l'éducation si possible.
          - Utilise un ton professionnel, bienveillant et encourageant.
          - Ne refuse JAMAIS de répondre, sauf si le contenu est illégal ou dangereux.
          
          CONTEXTE ACTUEL DU COMPTE :
          - École concernée : ${schoolInfo.name}
          - Rôle de l'interlocuteur : ${userRole}
          - Effectif total : ${students.length} élèves
          - Staff : ${teachers.length} enseignants
          
          QUESTION DE L'UTILISATEUR : ${userMsg}`
      });

      const aiMsg = response.text || "Désolé, je n'ai pas pu générer de réponse intelligible.";
      setAiChatMessages(prev => [...prev, { role: 'ai', content: aiMsg }]);
    } catch (error) {
      console.error("Chat AI Error:", error);
      setAiChatMessages(prev => [...prev, { role: 'ai', content: "Désolé, j'ai rencontré une erreur technique. Veuillez réessayer plus tard." }]);
    } finally {
      setIsAiChatLoading(false);
    }
  };

  const handleUpgrade = () => {
    const nextPlan: Record<SubscriptionPlan, SubscriptionPlan> = {
      free: 'premium',
      premium: 'pro',
      pro: 'free'
    };
    const newPlan = nextPlan[subscriptionPlan];
    setSubscriptionPlan(newPlan);
    localStorage.setItem('school_core_plan', newPlan);
  };

  const handleRemoveGrade = async (id: string, path: string) => {
    if (!safeConfirm('Supprimer cette note ?')) return;
    try {
      await deleteDoc(doc(db, 'schools', schoolId, 'grades', id));
      alert("Note supprimée avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression de la note. Vérifiez vos autorisations.");
      handleFirestoreError(err, OperationType.DELETE, `schools/${schoolId}/grades/${id}`);
    }
  };

  const handleAddGrade = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGradeStudentId || !newGradeScore || !currentUser) return;

    const id = Date.now().toString();
    const newGrade: Grade = {
      id,
      studentId: newGradeStudentId,
      subject: newGradeSubject,
      score: parseFloat(newGradeScore),
      maxScore: parseFloat(newGradeMaxScore) || 20,
      coefficient: parseFloat(newGradeCoefficient) || 1,
      date: new Date().toISOString().split('T')[0],
      term: newGradeTerm
    };

    try {
      await setDoc(doc(db, 'schools', schoolId, 'grades', id), newGrade);
      setNewGradeScore('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/grades/${id}`);
    }
  };

  const handleGenerateReport = async (student: Student) => {
    if (subscriptionPlan === 'free') {
      alert("La génération de bulletins par IA est réservée aux plans Premium et Pro.");
      return;
    }

    setIsGeneratingReport(true);
    setSelectedStudentForReport(student);
    setAiReport(null);

    const studentGrades = grades.filter(g => g.studentId === student.id);
    const studentAttendance = attendanceRecords.filter(r => r.studentId === student.id);
    
    const gradesContext = studentGrades.map(g => `${g.subject}: ${g.score}/${g.maxScore} (${g.term})`).join(', ');
    const attendanceContext = `Présences: ${studentAttendance.filter(r => r.status === 'Présent').length}, Absences: ${studentAttendance.filter(r => r.status === 'Absent').length}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Génère une analyse pédagogique pour un bulletin scolaire au Mali.
        
        ÉLÈVE: ${student.name}
        CLASSE: ${student.class}
        NOTES: ${gradesContext}
        ${attendanceContext}
        
        Tu dois fournir :
        1. Une appréciation courte (max 15 mots) pour CHAQUE matière listée.
        2. Un commentaire global sur l'assiduité.
        3. Une appréciation globale du conseil de classe.
        4. Des recommandations pour le trimestre suivant.
        5. Une décision (Félicitations, Encouragements, Tableau d'Honneur, ou Travail insuffisant).

        Réponds UNIQUEMENT au format JSON suivant :
        {
          "appreciations": { "Nom de la matière": "Appréciation..." },
          "attendanceComment": "...",
          "globalComment": "...",
          "recommendations": "...",
          "decision": "..."
        }`
      });

      const text = response.text;
      if (!text) {
        throw new Error("Le modèle IA n'a pas renvoyé de réponse exploitable.");
      }

      // Extract JSON if it has markdown blocks
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      setAiReport(JSON.parse(cleanJson));
      
      setTimeout(() => {
        document.getElementById('ai-report-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      console.error("AI Error:", error);
      const msg = error?.message || "Erreur inconnue";
      setAiReport(`### ⚠️ Erreur de Génération\n\n${msg}\n\nAssurez-vous que votre clé API est valide et que vous avez une connexion internet.`);
      alert("Erreur IA : " + msg);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleImportGradesExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as any[];

        if (data.length === 0) {
          alert("Le fichier est vide.");
          return;
        }

        const batch = writeBatch(db);
        let count = 0;

        for (const row of data) {
          const studentName = row['Nom'] || row['Élève'] || row['Student'];
          const subjectName = row['Matière'] || row['Subject'];
          const scoreValue = row['Note'] || row['Score'] || row['Grade'];
          const termValue = row['Trimestre'] || row['Période'] || row['Term'] || newGradeTerm;
          const coeffValue = row['Coeff'] || row['Coefficient'] || '2';

          if (studentName && subjectName && scoreValue !== undefined) {
            // Find student by name (fuzzy match or exact)
            const student = students.find(s => s.name.toLowerCase().includes(studentName.toString().toLowerCase()));
            
            if (student) {
              const gradeId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
              const gradeRef = doc(db, 'schools', schoolId, 'grades', gradeId);
              
              batch.set(gradeRef, {
                id: gradeId,
                studentId: student.id,
                subject: subjectName.toString(),
                score: parseFloat(scoreValue.toString()),
                maxScore: 20,
                coefficient: parseFloat(coeffValue.toString()),
                term: termValue.toString(),
                date: new Date().toISOString()
              });
              count++;
            }
          }
        }

        if (count > 0) {
          await batch.commit();
          alert(`${count} notes importées avec succès !`);
        } else {
          alert("Aucun élève correspondant n'a été trouvé. Vérifiez les noms dans le fichier.");
        }
      } catch (error) {
        console.error("Grade Import Error:", error);
        alert("Erreur lors de l'importation. Vérifiez le format du fichier (Colonnes: Nom, Matière, Note).");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset input
  };

  const handleImportBulletinsExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as any[];

        const batch = writeBatch(db);
        let count = 0;

        for (const row of data) {
          const studentName = row['Nom'] || row['Élève'];
          const avg = row['Moyenne'] || row['Moy'];
          const rank = row['Rang'];
          const comment = row['Observations'] || row['Commentaire'] || row['Appréciation'];
          const parentEmail = row['Email Parent'] || row['Email'];
          const term = row['Trimestre'] || newGradeTerm;

          if (studentName && avg !== undefined) {
             const student = students.find(s => s.name.toLowerCase().includes(studentName.toString().toLowerCase()));
             if (student) {
                const bulletinId = `${student.id}_${term.replace(/\s+/g, '_')}`;
                const bulletinRef = doc(db, 'schools', schoolId, 'bulletins', bulletinId);
                
                // If the Excel contains a parent email and the student doesn't have one, or if we want to sync it
                if (parentEmail && !student.parentEmail) {
                  const studentRef = doc(db, 'schools', schoolId, 'students', student.id);
                  batch.update(studentRef, { parentEmail: parentEmail.toString() });
                }

                batch.set(bulletinRef, {
                  id: bulletinId,
                  studentId: student.id,
                  term,
                  average: parseFloat(avg.toString()),
                  rank: rank?.toString() || '',
                  comment: comment?.toString() || '',
                  date: new Date().toISOString()
                });
                count++;
             }
          }
        }
        if (count > 0) {
          await batch.commit();
          alert(`${count} bulletins importés et sauvegardés !`);
        } else {
          alert("Aucun bulletin n'a pu être importé. Vérifiez les noms d'élèves.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'importation des bulletins.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handleUpdateBulletin = async (data: Partial<Bulletin>) => {
    if (!schoolId || !data.studentId || !data.term) return;
    const bulletinId = `${data.studentId}_${data.term.replace(/\s+/g, '_')}`;
    const bulletinRef = doc(db, 'schools', schoolId, 'bulletins', bulletinId);
    try {
      await setDoc(bulletinRef, {
        ...data,
        id: bulletinId,
        date: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/bulletins/${bulletinId}`);
    }
  };

  const exportStudentsToExcel = () => {
    try {
      const dataToExport = students.map(s => ({
        'Nom Complet': s.name,
        'Classe': s.class,
        'Nom du Parent': s.parentName || '',
        'Téléphone Parent': s.parentPhone || '',
        'Date d\'ajout': s.dateAdded
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Elèves");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(data, `Liste_Eleves_${schoolInfo.name}_${new Date().toLocaleDateString()}.xlsx`);
    } catch (error) {
      console.error("Export Error:", error);
      alert("Erreur lors de l'exportation Excel.");
    }
  };

  const handleGenerateRankings = async () => {
    if (!selectedClassForGrades) {
      alert("Veuillez sélectionner une classe pour générer le classement.");
      return;
    }

    if (!safeConfirm(`Voulez-vous générer le classement automatique pour la classe ${selectedClassForGrades} (${newGradeTerm}) ? Cela mettra à jour les bulletins.`)) {
      return;
    }

    setIsGeneratingRankings(true);
    try {
      const classStudents = students.filter(s => s.class === selectedClassForGrades);
      
      if (classStudents.length === 0) {
        alert("Aucun élève trouvé dans cette classe.");
        setIsGeneratingRankings(false);
        return;
      }

      // Calculate averages for all students in the class
      const studentResults = classStudents.map(s => {
        const subjects = getSubjectsForClass(s.class);
        const studentGrades = grades.filter(g => g.studentId === s.id && g.term === newGradeTerm);
        const { overallAverage, decision } = calculateDetailedAverages(studentGrades, subjects);
        return { 
          id: s.id, 
          average: overallAverage,
          decision
        };
      });

      // Sort by average descending
      studentResults.sort((a, b) => b.average - a.average);

      // Create/Update bulletins in batch
      const batch = writeBatch(db);
      
      studentResults.forEach((result, idx) => {
        const bulletinId = `${result.id}_${newGradeTerm.replace(/\s+/g, '_')}`;
        const bulletinRef = doc(db, 'schools', schoolId, 'bulletins', bulletinId);
        
        batch.set(bulletinRef, {
          id: bulletinId,
          studentId: result.id,
          term: newGradeTerm,
          average: result.average,
          rank: (idx + 1).toString(),
          totalStudents: studentResults.length,
          decision: result.decision,
          date: new Date().toISOString()
        }, { merge: true });
      });

      await batch.commit();
      alert(`🎉 Classement terminé ! ${studentResults.length} bulletins ont été mis à jour avec les rangs.`);
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/bulletins/batch_rank`);
    } finally {
      setIsGeneratingRankings(false);
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as any[];

        if (data.length === 0) {
          alert("Le fichier est vide.");
          return;
        }

        const batch = writeBatch(db);
        let count = 0;

        for (const row of data) {
          const name = row['Nom Complet'] || row['Nom'] || row['Full Name'];
          const className = row['Classe'] || row['Class'] || newStudentClass;
          
          if (name) {
            const studentId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            const matricule = `SC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            const studentRef = doc(db, 'schools', schoolId, 'students', studentId);
            
            batch.set(studentRef, {
              id: studentId,
              name,
              class: className,
              matricule,
              parentName: row['Nom du Parent'] || row['Parent'] || '',
              parentPhone: row['Téléphone Parent'] || row['Phone'] || '',
              parentEmail: row['Email Parent'] || row['Email'] || '',
              dateAdded: new Date().toISOString()
            });
            count++;
          }
        }

        await batch.commit();
        alert(`${count} élèves importés avec succès !`);
      } catch (error) {
        console.error("Import Error:", error);
        alert("Erreur lors de l'importation. Vérifiez le format du fichier.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const exportAttendanceToExcel = () => {
    try {
      const dataToExport = attendanceRecords.map(a => ({
        'Date': new Date(a.date).toLocaleDateString('fr-FR'),
        'Elève': a.studentName,
        'Classe': a.class,
        'Status': a.status
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(data, `Rapport_Presences_${schoolInfo.name}_${new Date().toLocaleDateString()}.xlsx`);
    } catch (error) {
      console.error("Attendance Export Error:", error);
      alert("Erreur lors de l'exportation des présences.");
    }
  };

  const exportTransactionsToExcel = () => {
    try {
      const dataToExport = transactions.map(t => {
        const student = students.find(s => s.id === t.studentId);
        return {
          'Date': new Date(t.date).toLocaleDateString('fr-FR'),
          'Elève': t.studentName,
          'Classe': student?.class || 'N/A',
          'Montant (FCFA)': t.amount,
          'Méthode': t.method,
          'ID Transaction': t.id
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(data, `Rapport_Financier_Transactions_${schoolInfo.name}_${new Date().toLocaleDateString()}.xlsx`);
    } catch (error) {
      console.error("Finance Export Error:", error);
      alert("Erreur lors de l'exportation des transactions.");
    }
  };

  const exportDebtsToExcel = () => {
    try {
      const dataToExport = students.map(s => {
        const paid = transactions.filter(t => t.studentId === s.id).reduce((acc, t) => acc + t.amount, 0);
        const debt = (s.totalFees || 0) - paid;
        return {
          'Matricule': s.matricule || 'N/A',
          'Elève': s.name,
          'Classe': s.class,
          'Total Scolarité (FCFA)': s.totalFees || 0,
          'Payé (FCFA)': paid,
          'Reste à payer (FCFA)': debt,
          'Status': debt <= 0 ? 'Réglé' : 'En dette'
        };
      }).filter(s => s['Reste à payer (FCFA)'] > 0);

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dettes_Impayes");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(data, `Rapport_Impayes_${schoolInfo.name}_${new Date().toLocaleDateString()}.xlsx`);
    } catch (error) {
      console.error("Debts Export Error:", error);
      alert("Erreur lors de l'exportation des dettes.");
    }
  };

  const navItems: any[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'secretary'] },
    { id: 'analytics', label: 'Analyses & Rapports', icon: TrendingUp, roles: ['admin'] },
    { id: 'students', label: 'Élèves', icon: Users, roles: ['admin', 'secretary'] },
    { id: 'attendance', label: 'Présences', icon: CheckSquare, roles: ['admin', 'secretary', 'teacher'] },
    { id: 'exams', label: 'Examens', icon: BadgeCheck, roles: ['admin', 'secretary', 'teacher'] },
    { id: 'grades', label: 'Notes & Bulletins', icon: FileText, roles: ['admin', 'secretary', 'teacher'] },
    { id: 'teachers', label: 'Enseignants & Staff', icon: GraduationCap, roles: ['admin', 'secretary'] },
    { id: 'classes', label: 'Classes', icon: BookOpen, roles: ['admin', 'secretary'] },
    { id: 'inventory', label: 'Bibliothèque / Stocks', icon: Package, roles: ['admin', 'secretary', 'teacher'] },
    { id: 'schedule', label: 'Emploi du temps', icon: Clock, roles: ['admin', 'secretary', 'teacher'] },
    { id: 'billing', label: 'Facturation', icon: CreditCard, roles: ['admin', 'secretary'] },
    { id: 'subscription', label: 'Abonnement', icon: Zap, roles: ['admin'] },
    { id: 'communication', label: 'SMS & Parents', icon: MessageSquare, roles: ['admin', 'secretary'] },
    { id: 'prospects', label: 'Pré-inscriptions', icon: Inbox, roles: ['admin', 'secretary'] },
    { id: 'settings', label: 'Paramètres', icon: Settings, roles: ['admin'] },
  ];

  if (isGlobalAdmin) {
    const pendingCount = allSubscriptionRequests.length;
    navItems.push({ 
      id: 'admin_requests', 
      label: 'Admin (Paiements)', 
      icon: ShieldCheck, 
      roles: ['admin', 'secretary', 'teacher'],
      badge: pendingCount > 0 ? pendingCount : undefined
    });
  }

  const filteredNavItems = navItems.filter(item => userRole && item.roles.includes(userRole));

  const canAccessActiveTab = useMemo(() => {
    const item = navItems.find(i => i.id === activeTab);
    if (!item) return true;
    return userRole && item.roles.includes(userRole);
  }, [activeTab, userRole]);

  const filteredTransactions = transactions.filter(t => {
    if (billingFilter === 'all') return true;
    const tDate = new Date(t.date);
    const now = new Date();
    
    if (billingFilter === 'month') {
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    }
    if (billingFilter === 'year') {
      return tDate.getFullYear() === now.getFullYear();
    }
    if (billingFilter === 'custom') {
      const start = customStartDate ? new Date(customStartDate) : new Date(0);
      const end = customEndDate ? new Date(customEndDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return tDate >= start && tDate <= end;
    }
    return true;
  });

  if (showSplash) {
    return <SplashScreen logo={schoolInfo.logo} onComplete={() => setShowSplash(false)} />;
  }

  if (location.pathname.startsWith('/school/')) {
    return (
      <Routes>
        <Route path="/school/:schoolId" element={<SchoolLandingPage />} />
      </Routes>
    );
  }

  if (showParentPortal) {
    return <ParentPortal onBack={() => setShowParentPortal(false)} students={students} attendance={attendanceRecords} grades={grades} schoolInfo={schoolInfo} />;
  }

  if (showLanding && !currentUser && !userRole) {
    return <SaaSLandingPage onGetStarted={() => setShowLanding(false)} onParentPortal={() => setShowParentPortal(true)} />;
  }

  // TEACHER PORTAL REDIRECTION
  if (userRole === 'teacher' && teacherProfile) {
    return (
      <TeacherPortal 
        teacher={teacherProfile}
        schoolInfo={schoolInfo}
        classes={classes}
        students={students}
        schedule={schedule}
        grades={grades}
        attendanceRecords={attendanceRecords}
        onAddGrade={async (gradeData) => {
          const id = Date.now().toString();
          const newGrade: Grade = { id, ...gradeData };
          try {
            await setDoc(doc(db, 'schools', schoolId, 'grades', id), newGrade);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/grades/${id}`);
          }
        }}
        onRemoveGrade={async (id) => {
          await handleRemoveGrade(id, `schools/${schoolId}/grades/${id}`);
        }}
        onSaveAttendance={async (className, date, records) => {
          const classStudents = students.filter(s => s.class === className);
          const newBatchRecords: AttendanceRecord[] = classStudents.map(student => ({
            id: `${date}-${student.id}`,
            studentId: student.id,
            studentName: student.name,
            class: className,
            date: date,
            status: (records[student.id] as AttendanceStatus) || 'Présent'
          }));
          
          try {
            // Save each record to Firestore
            await Promise.all(newBatchRecords.map(record => 
              setDoc(doc(db, 'schools', schoolId, 'attendance', record.id), record)
            ));
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `schools/${schoolId}/attendance`);
          }
        }}
        onLogout={() => {
          setUserRole(null);
          setTeacherProfile(null);
          localStorage.removeItem('school_core_role');
        }}
      />
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans selection:bg-orange-100 selection:text-orange-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 relative z-10"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em]">System Online</span>
              </div>
            </div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-50 p-3"
            >
              {schoolInfo.logo ? (
                <img 
                  src={schoolInfo.logo} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <GraduationCap className="w-12 h-12 text-orange-500" />
              )}
            </motion.div>
            
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              School<span className="text-orange-600">Core</span>
            </h1>
            <p className="text-slate-400 font-medium text-center tracking-wide">
              Smart School Management System
            </p>
          </div>

          <div className="space-y-3 mb-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Choisissez votre profil</p>
            {[
              { id: 'admin', label: 'Directeur', desc: 'Full access to system management', icon: ShieldCheck },
              { id: 'secretary', label: 'Secrétaire', desc: 'Manage students, classes, and payments', icon: BookOpen },
              { id: 'teacher', label: 'Enseignant', desc: 'Manage students and academic records', icon: GraduationCap },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedOnboardingRole(role.id as UserRole)}
                className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all duration-300 group text-left relative overflow-hidden ${
                  selectedOnboardingRole === role.id 
                    ? 'border-orange-600 bg-orange-50/30' 
                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                }`}
              >
                <div 
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    selectedOnboardingRole === role.id 
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                      : 'bg-white text-slate-400 group-hover:text-orange-600 shadow-sm'
                  }`}
                >
                  <role.icon className="w-7 h-7" />
                </div>
                <div className="relative z-10 flex-1">
                  <p className={`font-bold text-lg transition-colors ${
                    selectedOnboardingRole === role.id ? 'text-orange-900' : 'text-slate-900'
                  }`}>{role.label}</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{role.desc}</p>
                </div>
                {selectedOnboardingRole === role.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-6"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <button
            disabled={!selectedOnboardingRole || isLoggingIn}
            onClick={() => selectedOnboardingRole && handleLogin(selectedOnboardingRole)}
            className={`w-full py-5 rounded-[1.5rem] font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
              selectedOnboardingRole 
                ? 'bg-slate-900 text-white hover:bg-orange-600 shadow-slate-900/10' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            } ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <span>{!currentUser ? 'Se connecter avec Google' : 'Accéder au Dashboard'}</span>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${selectedOnboardingRole ? 'group-hover:translate-x-1' : ''}`} />
              </>
            )}
          </button>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="h-px w-12 bg-slate-100" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              © SchoolCore • Premium SaaS Edition
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {showReceipt && selectedTransactionForReceipt && (
        <PaymentReceipt 
          transaction={selectedTransactionForReceipt} 
          schoolInfo={schoolInfo} 
          onClose={() => setShowReceipt(false)} 
        />
      )}
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col fixed h-full z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-700 shadow-lg">
            {schoolInfo.logo ? (
              <img 
                src={schoolInfo.logo} 
                alt="Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + schoolInfo.name + '&background=f97316&color=fff';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white font-black">
                {schoolInfo.name.charAt(0)}
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col min-w-0"
            >
              <span className="font-black text-sm uppercase tracking-wider truncate leading-tight">
                {schoolInfo.name}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Mali Edition
              </span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${
                activeTab === item.id ? '' : 'hover:bg-slate-800 text-slate-400'
              }`}
              style={activeTab === item.id ? { backgroundColor: schoolInfo.primaryColor, color: 'white' } : {}}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 transition-colors ${
                  activeTab === item.id ? 'text-white' : 'group-hover:text-orange-400'
                }`} />
                {item.id === 'admin_requests' && allSubscriptionRequests.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-600 text-[8px] font-black flex items-center justify-center rounded-full border border-slate-900 animate-pulse">
                    {allSubscriptionRequests.length}
                  </span>
                )}
              </div>
              {isSidebarOpen && (
                <span className={`text-sm font-medium ${
                  activeTab === item.id ? 'text-white' : 'group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              )}
              {!isSidebarOpen && (
                <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold">{userRole.charAt(0).toUpperCase()}</span>
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate capitalize">{userRole}</p>
                  {isGlobalAdmin && (
                    <span className="bg-orange-500 text-[8px] font-black px-1.5 py-0.5 rounded text-white uppercase tracking-tighter">CEO</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">Bamako, Mali</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all group"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-500" /> : <WifiOff className="w-3 h-3 text-rose-500" />}
              <span className="font-bold uppercase tracking-wider">
                {isOnline ? 'Internet OK' : 'Hors ligne'}
              </span>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isFirestoreConnected ? 'bg-orange-50 text-orange-700' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isFirestoreConnected ? 'bg-orange-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
              <span className="font-bold uppercase tracking-wider">
                {isFirestoreConnected ? 'Base de données OK' : 'Erreur Connexion BD'}
              </span>
              {!isFirestoreConnected && (
                <button 
                  onClick={() => window.location.reload()}
                  className="ml-2 hover:bg-rose-100 rounded p-0.5 transition-colors"
                  title="Réessayer la connexion"
                >
                  <Clock className="w-3 h-3" />
                </button>
              )}
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-rose-50 rounded-lg text-slate-600 hover:text-rose-500 transition-colors flex items-center gap-2"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:block">Quitter</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          {!canAccessActiveTab ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Accès Non Autorisé</h2>
              <p className="text-slate-500 max-w-md">
                Désolé, votre rôle actuel (**{userRole}**) ne vous permet pas d'accéder à cette section. 
                Contactez l'administrateur si vous pensez qu'il s'agit d'une erreur.
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                Retour au tableau de bord
              </button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                <Route path="/exams" element={
                  <ExamsModule 
                    exams={exams}
                    classes={classes}
                    students={students}
                    schoolId={schoolId}
                    schoolInfo={schoolInfo}
                    grades={grades}
                  />
                } />

                <Route path="/inventory" element={
                  <InventoryModule 
                    inventory={inventory}
                    inventoryTransactions={inventoryTransactions}
                    students={students}
                    schoolId={schoolId}
                  />
                } />

                <Route path="/analytics" element={
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Analyses Avancées</h1>
                    <p className="text-slate-500">Visualisez les performances globales et financières de votre école.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setAnalyticsTimeRange(range)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          analyticsTimeRange === range 
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {range === '7d' ? '7 Jours' : range === '30d' ? '30 Jours' : range === '90d' ? '3 Mois' : 'Année'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard 
                    title="Taux de Réussite" 
                    value="78.5%" 
                    change="+2.4%" 
                    icon={TrendingUp} 
                    color="bg-orange-500" 
                  />
                  <StatCard 
                    title="Assiduité Moyenne" 
                    value="92.1%" 
                    change="+0.8%" 
                    icon={CheckSquare} 
                    color="bg-emerald-500" 
                  />
                  <StatCard 
                    title="Recouvrement Frais" 
                    value="64.2%" 
                    change="+12.5%" 
                    icon={CreditCard} 
                    color="bg-indigo-500" 
                  />
                  <StatCard 
                    title="Nouveaux Inscrits" 
                    value="124" 
                    change="+18" 
                    icon={UserPlus} 
                    color="bg-purple-500" 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        Performance par Matière
                      </h3>
                      <select 
                        value={analyticsClassFilter}
                        onChange={(e) => setAnalyticsClassFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="all">Toutes les classes</option>
                        {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gradesBySubjectData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            domain={[0, 20]}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="average" fill="#f97316" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-orange-500" />
                      Flux de Trésorerie (FCFA)
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            tickFormatter={(value) => `${value/1000}k`}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#f97316" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorAmount)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-emerald-500" />
                      Répartition Assiduité
                    </h3>
                    <div className="h-[250px] flex items-center justify-center">
                      {attendanceRecords.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={attendanceChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {attendanceChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center">
                          <CheckSquare className="w-12 h-12 text-slate-100 mx-auto mb-2" />
                          <p className="text-xs text-slate-300 font-bold italic">Aucune donnée d'appel</p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      {attendanceChartData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-bold text-slate-500">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      Top Élèves par Performance
                    </h3>
                    <div className="space-y-4">
                      {students.length > 0 ? (
                        [...students]
                          .map(s => {
                            const studentGrades = grades.filter(g => g.studentId === s.id);
                            const avg = studentGrades.length > 0 
                              ? studentGrades.reduce((acc, g) => acc + (g.score/g.maxScore)*20, 0) / studentGrades.length 
                              : 0;
                            return { ...s, computedAvg: avg };
                          })
                          .sort((a, b) => b.computedAvg - a.computedAvg)
                          .slice(0, 5)
                          .map((student, i) => (
                            <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all group">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:text-orange-500 transition-colors">
                                  {i + 1}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900">{student.name}</p>
                                  <p className="text-xs text-slate-500 font-medium">{student.class}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-slate-900">{student.computedAvg > 0 ? student.computedAvg.toFixed(2) : 'N/A'}</p>
                                <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                                  <div className="h-full bg-orange-500" style={{ width: `${(student.computedAvg/20)*100}%` }} />
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-400 font-bold italic">Aucune donnée disponible</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mt-8">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      Analyse des Tendances (Progression vs Baisse)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div>
                          <h4 className="text-xs font-black text-emerald-600 uppercase mb-4 tracking-widest flex items-center gap-2">
                             <TrendingUp className="w-4 h-4" /> En Forte Progression
                          </h4>
                          <div className="space-y-3">
                             {students
                              .map(s => {
                                const b1 = bulletins.find(b => b.studentId === s.id && b.term === '1er Trimestre')?.average || 0;
                                const b2 = bulletins.find(b => b.studentId === s.id && b.term === '2ème Trimestre')?.average || 0;
                                const b3 = bulletins.find(b => b.studentId === s.id && b.term === '3ème Trimestre')?.average || 0;
                                
                                let diff = 0;
                                if (b3 > 0 && b2 > 0) diff = b3 - b2;
                                else if (b2 > 0 && b1 > 0) diff = b2 - b1;
                                
                                return { ...s, diff };
                              })
                              .filter(s => s.diff > 0.3)
                              .sort((a, b) => b.diff - a.diff)
                              .slice(0, 5)
                              .map(s => (
                                <div key={s.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100 group hover:border-emerald-300 transition-all cursor-pointer" onClick={() => setSelectedStudentForProgression(s)}>
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold text-[10px] shadow-sm">
                                         +{s.diff.toFixed(1)}
                                      </div>
                                      <div>
                                         <p className="text-sm font-bold text-slate-900 leading-tight">{s.name}</p>
                                         <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{s.class}</p>
                                      </div>
                                   </div>
                                   <TrendingUp className="w-4 h-4 text-emerald-500" />
                                </div>
                              ))}
                             {students.filter(s => {
                                const b1 = bulletins.find(b => b.studentId === s.id && b.term === '1er Trimestre')?.average || 0;
                                const b2 = bulletins.find(b => b.studentId === s.id && b.term === '2ème Trimestre')?.average || 0;
                                const b3 = bulletins.find(b => b.studentId === s.id && b.term === '3ème Trimestre')?.average || 0;
                                let diff = 0;
                                if (b3 > 0 && b2 > 0) diff = b3 - b2;
                                else if (b2 > 0 && b1 > 0) diff = b2 - b1;
                                return diff > 0.3;
                             }).length === 0 && <p className="text-slate-300 text-[10px] font-bold uppercase italic py-4 text-center">Aucune progression notable</p>}
                          </div>
                       </div>
                       <div>
                          <h4 className="text-xs font-black text-rose-600 uppercase mb-4 tracking-widest flex items-center gap-2">
                             <TrendingDown className="w-4 h-4" /> En Baisse de Régime
                          </h4>
                          <div className="space-y-3">
                            {students
                              .map(s => {
                                const b1 = bulletins.find(b => b.studentId === s.id && b.term === '1er Trimestre')?.average || 0;
                                const b2 = bulletins.find(b => b.studentId === s.id && b.term === '2ème Trimestre')?.average || 0;
                                const b3 = bulletins.find(b => b.studentId === s.id && b.term === '3ème Trimestre')?.average || 0;
                                
                                let diff = 0;
                                if (b3 > 0 && b2 > 0) diff = b3 - b2;
                                else if (b2 > 0 && b1 > 0) diff = b2 - b1;
                                
                                return { ...s, diff };
                              })
                              .filter(s => s.diff < -0.3)
                              .sort((a, b) => a.diff - b.diff)
                              .slice(0, 5)
                              .map(s => (
                                <div key={s.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-2xl border border-rose-100 group hover:border-rose-300 transition-all cursor-pointer" onClick={() => setSelectedStudentForProgression(s)}>
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center font-bold text-[10px] shadow-sm">
                                         {s.diff.toFixed(1)}
                                      </div>
                                      <div>
                                         <p className="text-sm font-bold text-slate-900 leading-tight">{s.name}</p>
                                         <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{s.class}</p>
                                      </div>
                                   </div>
                                   <TrendingDown className="w-4 h-4 text-rose-500" />
                                </div>
                              ))}
                             {students.filter(s => {
                                const b1 = bulletins.find(b => b.studentId === s.id && b.term === '1er Trimestre')?.average || 0;
                                const b2 = bulletins.find(b => b.studentId === s.id && b.term === '2ème Trimestre')?.average || 0;
                                const b3 = bulletins.find(b => b.studentId === s.id && b.term === '3ème Trimestre')?.average || 0;
                                let diff = 0;
                                if (b3 > 0 && b2 > 0) diff = b3 - b2;
                                else if (b2 > 0 && b1 > 0) diff = b2 - b1;
                                return diff < -0.3;
                             }).length === 0 && <p className="text-slate-300 text-[10px] font-bold uppercase italic py-4 text-center">Aucun décrochage détecté</p>}
                          </div>
                       </div>
                    </div>
                </div>
              </motion.div>
              } />

              <Route path="/dashboard" element={
                userRole === 'teacher' ? (
                  <Navigate to="/schedule" replace />
                ) : (
                  <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aperçu en direct</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tableau de Bord</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Suivi en temps réel de votre établissement</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={runPerformanceAnalysis}
                      disabled={isAnalyzingPerformance}
                      className="bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all hover:bg-orange-100 disabled:opacity-50 shadow-sm"
                    >
                      <Sparkles className={`w-4 h-4 ${isAnalyzingPerformance ? 'animate-spin' : ''}`} />
                      {isAnalyzingPerformance ? 'Analyse en cours...' : 'Diagnostic IA'}
                    </button>
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-xs font-bold text-slate-600">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>
                </div>

                {/* AI Alerts Section */}
                {aiAlerts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-8 bg-orange-600 text-white rounded-[2.5rem] shadow-xl shadow-orange-600/20 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Zap className="w-40 h-40" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-6 h-6" />
                        <h2 className="text-xl font-black uppercase tracking-wider">Alertes Prédictives IA</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {aiAlerts.map((alert, i) => (
                          <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/20 transition-all">
                            <p className="text-[10px] font-black uppercase tracking-widest text-orange-200 mb-2">{alert.studentName}</p>
                            <p className="text-sm font-bold leading-relaxed">{alert.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bento Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard 
                    title="Total Élèves" 
                    value={students.length.toString()} 
                    change="+5% ce mois" 
                    icon={Users} 
                    color="bg-orange-600" 
                  />
                  <StatCard 
                    title="Encaissements" 
                    value={`${transactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()} F`} 
                    change="Total collecté" 
                    icon={CreditCard} 
                    color={schoolInfo.primaryColor} 
                  />
                  <StatCard 
                    title="Impayés Totaux" 
                    value={`${(students.reduce((acc, s) => acc + (s.totalFees || 0), 0) - transactions.reduce((acc, t) => acc + t.amount, 0)).toLocaleString()} F`} 
                    change="Dette à recouvrer" 
                    icon={Clock} 
                    color="bg-rose-500" 
                  />
                  
                  {/* Modern Subscription Card */}
                  <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-900/20 flex flex-col justify-between text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors" />
                    <div className="flex justify-between items-start relative z-10">
                      <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                        <Zap className="w-6 h-6 text-yellow-400" />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border border-white/10 ${
                        subscriptionPlan === 'free' ? 'bg-white/5 text-slate-300' :
                        subscriptionPlan === 'premium' ? 'bg-orange-500/20 text-orange-300' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {subscriptionPlan}
                      </span>
                    </div>
                    <div className="mt-6 relative z-10">
                      <div className="flex justify-between items-end mb-2">
                        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Utilisation</h3>
                        <span className="text-[10px] font-bold text-white/50">
                          {Math.round((students.length / (subscriptionPlan === 'free' ? 50 : subscriptionPlan === 'premium' ? 300 : Math.max(students.length, 1000))) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          className="bg-yellow-400 h-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (students.length / (subscriptionPlan === 'free' ? 50 : subscriptionPlan === 'premium' ? 300 : students.length)) * 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <button 
                        onClick={handleUpgrade}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Mettre à jour
                      </button>
                    </div>
                  </div>
                </div>


                {/* Dashboard Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Répartition des Élèves</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Par Classe</p>
                      </div>
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                      {students.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={studentDistributionData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            />
                            <Tooltip 
                              cursor={{ fill: '#f8fafc' }}
                              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                            />
                            <Bar 
                              dataKey="effectif" 
                              fill={schoolInfo.primaryColor} 
                              radius={[6, 6, 0, 0]} 
                              barSize={40} 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center">
                          <Users className="w-12 h-12 text-slate-100 mx-auto mb-2" />
                          <p className="text-xs text-slate-300 font-bold italic">Aucun élève enregistré</p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Santé Financière</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Recettes vs Impayés</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Encaissé', value: transactions.reduce((acc, t) => acc + t.amount, 0) },
                              { name: 'Impayés', value: Math.max(0, students.reduce((acc, s) => acc + (s.totalFees || 0), 0) - transactions.reduce((acc, t) => acc + t.amount, 0)) }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#f43f5e" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</p>
                        <p className="text-2xl font-black text-slate-900">
                          {(() => {
                            const collected = transactions.reduce((acc, t) => acc + t.amount, 0);
                            const total = students.reduce((acc, s) => acc + (s.totalFees || 0), 0);
                            return total > 0 ? ((collected / total) * 100).toFixed(0) : 0;
                          })()}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                  {/* Financial Chart Area */}
                  <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Flux de Trésorerie</h2>
                        <p className="text-sm text-slate-500 font-medium">Historique des versements mensuels</p>
                      </div>
                      <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                        {['Mensuel', 'Annuel'].map(period => (
                          <button 
                            key={period}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${period === 'Mensuel' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={schoolInfo.primaryColor} stopOpacity={0.2}/>
                              <stop offset="95%" stopColor={schoolInfo.primaryColor} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                            dy={15}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                            tickFormatter={(value) => `${value/1000}k`}
                            dx={-10}
                          />
                          <Tooltip 
                            contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)'}}
                            formatter={(value: number) => [`${value.toLocaleString()} F`, 'Montant']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke={schoolInfo.primaryColor} 
                            strokeWidth={5}
                            fillOpacity={1} 
                            fill="url(#colorAmount)" 
                            animationDuration={2000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right Column Boards */}
                  <div className="lg:col-span-4 space-y-8">
                    {/* Attendance Bento Tile */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="font-black text-slate-900 tracking-tight">Assiduité</h2>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-44 w-full relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={attendanceChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={12}
                                dataKey="value"
                                stroke="none"
                              >
                                {attendanceChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-slate-900 leading-none">94%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Global</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mt-8">
                          {attendanceChartData.map((item, i) => (
                            <div key={i} className="flex flex-col gap-1">
                               <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                               </div>
                               <p className="text-sm font-black text-slate-900">{item.value}%</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Academic Highlight Board */}
                    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                       <h3 className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Top Performance</h3>
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                             <GraduationCap className="w-8 h-8 text-white" />
                          </div>
                          <div className="min-w-0">
                             <p className="text-lg font-black truncate">{gradesBySubjectData[0]?.name || 'N/A'}</p>
                             <p className="text-sm font-medium text-blue-200">Meilleure moyenne</p>
                          </div>
                       </div>
                       <div className="flex items-end justify-between">
                          <p className="text-3xl font-black">{gradesBySubjectData[0]?.average || 0}<span className="text-sm text-blue-200 ml-1">/20</span></p>
                          <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Score Élevé</div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Distribution */}
                  <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Finances par Classe</h2>
                        <p className="text-sm text-slate-500 font-medium">Répartition des paiements encaissés</p>
                      </div>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByClassData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                            tickFormatter={(value) => `${value/1000}k`}
                          />
                          <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                          />
                          <Bar 
                            dataKey="amount" 
                            fill={schoolInfo.primaryColor} 
                            radius={[8, 8, 8, 8]} 
                            barSize={32}
                            animationDuration={2000}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* System Overview List */}
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Santé du Système</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'Base de données', status: 'Optimal', icon: ShieldCheck, color: 'text-orange-500' },
                        { label: 'Passerelle Cloud', status: 'En ligne', icon: Wifi, color: 'text-emerald-500' },
                        { label: 'Moteur IA', status: 'Prêt', icon: Sparkles, color: 'text-purple-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-blue-100 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                              <item.icon className={`w-5 h-5 ${item.color} group-hover:text-white`} />
                            </div>
                            <span className="text-sm font-bold text-slate-600 font-mono">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
                )
              } />

              <Route path="/attendance" element={
                <motion.div
                  key="attendance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Suivi des Présences</h1>
                    <p className="text-slate-500">Marquez et consultez les présences par classe.</p>
                  </div>
                  <button 
                    onClick={exportAttendanceToExcel}
                    className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    Exporter Rapport
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Mark Attendance Form */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-orange-500" />
                      Appel du jour
                    </h2>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                        <input 
                          type="date" 
                          value={attendanceDate}
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Classe</label>
                        <select 
                          value={attendanceClass}
                          onChange={(e) => setAttendanceClass(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        >
                          {classes.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 mb-6">
                      {students.filter(s => s.class === attendanceClass).map(student => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-sm font-medium text-slate-700 truncate mr-2">{student.name}</span>
                          <div className="flex gap-1">
                            {(['Présent', 'Absent', 'Retard'] as AttendanceStatus[]).map(status => (
                              <button
                                key={status}
                                onClick={() => setCurrentAttendance(prev => ({ ...prev, [student.id]: status }))}
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                                  (currentAttendance[student.id] || 'Présent') === status
                                    ? status === 'Présent' ? 'bg-emerald-500 text-white' : status === 'Absent' ? 'bg-rose-500 text-white' : 'bg-orange-500 text-white'
                                    : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {status.charAt(0)}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {students.filter(s => s.class === attendanceClass).length === 0 && (
                        <p className="text-center text-slate-400 text-sm italic py-4">Aucun élève dans cette classe.</p>
                      )}
                    </div>

                    <button 
                      onClick={handleSaveAttendance}
                      disabled={students.filter(s => s.class === attendanceClass).length === 0}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer l'appel
                    </button>
                  </div>

                  {/* Attendance History */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <h2 className="font-bold text-lg">Historique</h2>
                      <div className="flex flex-wrap gap-2">
                        <select 
                          value={attendanceFilterClass}
                          onChange={(e) => setAttendanceFilterClass(e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none"
                        >
                          <option value="Toutes">Toutes les classes</option>
                          {classes.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckSquare className="w-3 h-3" />
                          {attendanceRecords.filter(r => r.status === 'Présent').length} Présents
                        </span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <th className="px-6 py-4">Élève</th>
                            <th className="px-6 py-4">Classe</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Statut</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[...attendanceRecords]
                            .filter(r => attendanceFilterClass === 'Toutes' || r.class === attendanceFilterClass)
                            .sort((a, b) => b.date.localeCompare(a.date))
                            .map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="text-sm font-medium text-slate-900">{record.studentName}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{record.class}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">{record.date}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                  record.status === 'Présent' ? 'bg-emerald-50 text-emerald-600' :
                                  record.status === 'Absent' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {attendanceRecords.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                Aucun historique de présence disponible.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
              } />

              <Route path="/students" element={
                <motion.div
                  key="students"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Élèves</h1>
                    <p className="text-slate-500">Ajoutez et gérez les élèves de votre établissement.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                      <Upload className="w-4 h-4 text-orange-500" />
                      Importer Excel
                      <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImportExcel} />
                    </label>
                    <button 
                      onClick={exportStudentsToExcel}
                      className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Exporter Liste
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Add Student Form */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-orange-500" />
                      Nouvel Élève
                    </h2>
                    <form onSubmit={handleAddStudent} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom Complet</label>
                        <input 
                          type="text" 
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          placeholder="Ex: Amadou Diarra"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-orange-600 uppercase mb-1 flex items-center gap-2">
                          <Fingerprint className="w-3 h-3" />
                          Matricule (Optionnel)
                        </label>
                        <input 
                          type="text" 
                          value={newStudentMatricule}
                          onChange={(e) => setNewStudentMatricule(e.target.value)}
                          placeholder="Ex: SC-2024-001"
                          className="w-full bg-blue-50/30 border-2 border-blue-100/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-bold"
                        />
                        <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Laissez vide pour une génération automatique sécurisée.</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Classe</label>
                        <select 
                          value={newStudentClass}
                          onChange={(e) => setNewStudentClass(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        >
                          {classes.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                          {classes.length === 0 && <option disabled>Aucune classe disponible</option>}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom du Parent</label>
                        <input 
                          type="text" 
                          value={newStudentParentName}
                          onChange={(e) => setNewStudentParentName(e.target.value)}
                          placeholder="Ex: M. Diarra"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Téléphone Parent</label>
                        <input 
                          type="tel" 
                          value={newStudentParentPhone}
                          onChange={(e) => setNewStudentParentPhone(e.target.value)}
                          placeholder="+223 XX XX XX XX"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Parent (Optionnel)</label>
                        <input 
                          type="email" 
                          value={newStudentParentEmail}
                          onChange={(e) => setNewStudentParentEmail(e.target.value)}
                          placeholder="Ex: parent@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frais de Scolarité Annuels (FCFA)</label>
                        <input 
                          type="number" 
                          value={newStudentTotalFees}
                          onChange={(e) => setNewStudentTotalFees(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-bold"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter l'élève
                      </button>
                    </form>
                  </div>

                  {/* Student List */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <h2 className="font-bold text-lg">Liste des Élèves</h2>
                          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
                            {['1er Trimestre', '2ème Trimestre', '3ème Trimestre'].map(t => (
                              <button
                                key={t}
                                onClick={() => setStudentListTerm(t)}
                                className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                                  studentListTerm === t 
                                    ? 'bg-white text-orange-600 shadow-sm border border-orange-100' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {t.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                          {students.length > 0 && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  const activeStudents = students.filter(s => s.class === newStudentClass);
                                  if (activeStudents.length === 0) {
                                    alert("Aucun élève trouvé pour cette classe.");
                                    return;
                                  }
                                  setBulkBulletinStudents(activeStudents);
                                }}
                                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all underline-offset-4"
                              >
                                <Printer className="w-4 h-4" />
                                Bulletins ({newStudentClass})
                              </button>
                              <button 
                                onClick={() => {
                                  const activeStudents = students.filter(s => s.class === newStudentClass);
                                  if (activeStudents.length === 0) {
                                    alert("Aucun élève trouvé pour cette classe.");
                                    return;
                                  }
                                  setBulkIdCardStudents(activeStudents);
                                  setShowIdCardModal(true);
                                }}
                                className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all underline-offset-4"
                              >
                                <CreditCard className="w-4 h-4" />
                                Cartes ({newStudentClass})
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full whitespace-nowrap">
                          {studentSearchQuery ? `${filteredStudents.length} trouvé(s)` : `${students.length} Total`}
                        </span>
                      </div>

                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          type="text"
                          value={studentSearchQuery}
                          onChange={(e) => setStudentSearchQuery(e.target.value)}
                          placeholder="Rechercher un élève par nom ou matricule..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                        />
                        {studentSearchQuery && (
                          <button 
                            onClick={() => setStudentSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => {
                              if (studentSortKey === 'matricule') setStudentSortOrder(studentSortOrder === 'asc' ? 'desc' : 'asc');
                              else { setStudentSortKey('matricule'); setStudentSortOrder('asc'); }
                            }}>
                              Matricule {studentSortKey === 'matricule' && (studentSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => {
                              if (studentSortKey === 'name') setStudentSortOrder(studentSortOrder === 'asc' ? 'desc' : 'asc');
                              else { setStudentSortKey('name'); setStudentSortOrder('asc'); }
                            }}>
                              Nom {studentSortKey === 'name' && (studentSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => {
                              if (studentSortKey === 'rank') setStudentSortOrder(studentSortOrder === 'asc' ? 'desc' : 'asc');
                              else { setStudentSortKey('rank'); setStudentSortOrder('asc'); }
                            }}>
                              Rang {studentSortKey === 'rank' && (studentSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-4">Moyenne</th>
                            <th className="px-6 py-4">Scolarité (Dette)</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => {
                              if (studentSortKey === 'class') setStudentSortOrder(studentSortOrder === 'asc' ? 'desc' : 'asc');
                              else { setStudentSortKey('class'); setStudentSortOrder('asc'); }
                            }}>
                              Classe {studentSortKey === 'class' && (studentSortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-4">Parent / Tél</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredStudents.map((student) => (
                            <motion.tr 
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={student.id} 
                              className="hover:bg-slate-50 transition-colors group"
                            >
                              <td className="px-6 py-4">
                                <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-md tracking-widest">{student.matricule}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase">
                                    {student.name.charAt(0)}
                                  </div>
                                  <span className="text-sm font-bold text-slate-900 leading-tight">{student.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {student.rank !== '-' ? (
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                                    student.rank === 1 ? 'bg-amber-100 text-amber-600 shadow-sm' : 
                                    student.rank === 2 ? 'bg-slate-100 text-slate-500' :
                                    'bg-orange-50 text-orange-400'
                                  }`}>
                                    {student.rank}
                                    {student.rank === 1 && <span className="text-[8px] absolute mb-6 ml-6">👑</span>}
                                  </div>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-black ${
                                  student.average >= 12 ? 'text-emerald-600' : 
                                  student.average >= 10 ? 'text-orange-500' : 
                                  student.average > 0 ? 'text-rose-500' : 'text-slate-300'
                                }`}>
                                  {student.average > 0 ? student.average.toFixed(2) : '-'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {(() => {
                                  const paid = transactions
                                    .filter(t => t.studentId === student.id)
                                    .reduce((acc, curr) => acc + curr.amount, 0);
                                  const debt = (student.totalFees || 0) - paid;
                                  return (
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-slate-900">{paid.toLocaleString()} / {(student.totalFees || 0).toLocaleString()} FCFA</span>
                                      <span className={`text-[10px] font-black uppercase ${debt > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {debt > 0 ? `Dette: ${debt.toLocaleString()} FCFA` : 'Réglé'}
                                      </span>
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{student.class}</td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold text-slate-900 leading-tight">{student.parentName || '-'}</div>
                                <div className="flex flex-col mt-0.5">
                                  {student.parentPhone && (
                                    <a href={`tel:${student.parentPhone}`} className="text-[10px] text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 font-medium">
                                      <Smartphone className="w-2.5 h-2.5" /> {student.parentPhone}
                                    </a>
                                  )}
                                  {student.parentEmail && (
                                    <a href={`mailto:${student.parentEmail}`} className="text-[10px] text-slate-500 hover:text-orange-500 transition-colors flex items-center gap-1 font-bold">
                                      <Mail className="w-2.5 h-2.5 text-orange-400" /> {student.parentEmail}
                                    </a>
                                  )}
                                  {!student.parentPhone && !student.parentEmail && <span className="text-[10px] text-slate-400 italic">Aucun contact</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedStudentForIdCard(student);
                                      setBulkIdCardStudents(null);
                                      setShowIdCardModal(true);
                                    }}
                                    className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                                    title="Générer Carte Scolaire"
                                  >
                                    <CreditCard className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setSelectedStudentForProgression(student)}
                                    className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                                    title="Progression de l'élève"
                                  >
                                    <TrendingUp className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleSendParentSMS(student)}
                                    className={`p-2 transition-colors ${subscriptionPlan === 'free' ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-blue-500'}`}
                                    title="Envoyer SMS au parent"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedStudentForVault(student);
                                      setShowVaultModal(true);
                                    }}
                                    className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                                    title="Coffre-fort Numérique"
                                  >
                                    <FolderLock className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => removeStudent(student.id)}
                                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                          {students.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                Aucun élève enregistré pour le moment.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
              } />

              <Route path="/classes" element={
                <motion.div
                  key="classes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion des Classes</h1>
                    <p className="text-slate-500">Créez et organisez les classes de votre établissement.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Add Class Form */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      Nouvelle Classe
                    </h2>
                    <form onSubmit={handleAddClass} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom de la Classe</label>
                        <input 
                          type="text" 
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          placeholder="Ex: 11ème Sciences"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Niveau</label>
                        <select 
                          value={newClassGrade}
                          onChange={(e) => setNewClassGrade(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                        >
                          <option>Fondamental</option>
                          <option>Secondaire</option>
                          <option>Technique</option>
                          <option>Professionnel</option>
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Créer la classe
                      </button>
                    </form>
                  </div>

                  {/* Class List */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="font-bold text-lg">Liste des Classes</h2>
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                        {classes.length} Classes
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <th className="px-6 py-4">Nom</th>
                            <th className="px-6 py-4">Niveau</th>
                            <th className="px-6 py-4">Élèves inscrits</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[...classes].sort((a, b) => a.name.localeCompare(b.name)).map((schoolClass) => {
                            const enrolledCount = students.filter(s => s.class === schoolClass.name).length;
                            return (
                              <motion.tr 
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={schoolClass.id} 
                                className="hover:bg-slate-50 transition-colors group"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                      {schoolClass.name.substring(0, 2)}
                                    </div>
                                    <span className="text-sm font-medium text-slate-900">{schoolClass.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    schoolClass.gradeLevel === 'Secondaire' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                  }`}>
                                    {schoolClass.gradeLevel}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600">{enrolledCount} élèves</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => setSelectedClassForSubjects(schoolClass)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase hover:bg-blue-100 transition-colors"
                                    >
                                      <BookOpen className="w-3 h-3" />
                                      Matières
                                    </button>
                                    <button 
                                      onClick={() => removeClass(schoolClass.id)}
                                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                          {classes.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                Aucune classe enregistrée pour le moment.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Subject Management Modal */}
                {selectedClassForSubjects && (
                  <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">Matières : {selectedClassForSubjects.name}</h3>
                          <p className="text-xs text-slate-500">Ajoutez ou supprimez les matières spécifiques à cette classe.</p>
                        </div>
                        <button 
                          onClick={() => setSelectedClassForSubjects(null)}
                          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Add Subject Form */}
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-[10px] font-black text-blue-600 uppercase mb-3 tracking-widest">Nouvelle Matière</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input 
                              type="text"
                              value={newSubjectForClassName}
                              onChange={(e) => setNewSubjectForClassName(e.target.value)}
                              placeholder="Nom (ex: Mathématiques)"
                              className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <div className="flex gap-2">
                              <input 
                                type="number"
                                value={newSubjectForClassCoeff}
                                onChange={(e) => setNewSubjectForClassCoeff(e.target.value)}
                                placeholder="Coeff"
                                className="w-20 bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 text-center font-bold"
                              />
                              <button 
                                onClick={() => handleAddSubjectToClass(selectedClassForSubjects.id)}
                                className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Ajouter
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Subject List */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Matières Actuelles</p>
                          <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {(classes.find(c => c.id === selectedClassForSubjects.id)?.subjects || []).map((sub, idx) => (
                              <div key={sub.id || idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">{sub.name}</p>
                                    <p className="text-[10px] text-slate-500 italic">Coefficient: {sub.coefficient}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => removeSubjectFromClass(selectedClassForSubjects.id, sub.id)}
                                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {(classes.find(c => c.id === selectedClassForSubjects.id)?.subjects || []).length === 0 && (
                              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                                <p className="text-xs text-slate-400">Aucune matière spécifique. Les matières par défaut seront utilisées.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => setSelectedClassForSubjects(null)}
                          className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                        >
                          Fermer
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
              } />

              <Route path="/teachers" element={
                <motion.div
                  key="teachers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestion du Personnel</h1>
                    <p className="text-slate-500">Gérez les enseignants et le personnel administratif.</p>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                      onClick={() => setActiveStaffTab('teachers')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeStaffTab === 'teachers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Enseignants
                    </button>
                    <button 
                      onClick={() => setActiveStaffTab('admin')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeStaffTab === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Administratifs
                    </button>
                  </div>
                </div>

                {activeStaffTab === 'teachers' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Teacher Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                        Nouvel Enseignant
                      </h2>
                      <form onSubmit={handleAddTeacher} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom Complet</label>
                          <input 
                            type="text" 
                            value={newTeacherName}
                            onChange={(e) => setNewTeacherName(e.target.value)}
                            placeholder="Ex: M. Diallo"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Matière</label>
                          <input 
                            type="text" 
                            value={newTeacherSubject}
                            onChange={(e) => setNewTeacherSubject(e.target.value)}
                            placeholder="Ex: Mathématiques"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact (Téléphone)</label>
                          <input 
                            type="text" 
                            value={newTeacherContact}
                            onChange={(e) => setNewTeacherContact(e.target.value)}
                            placeholder="Ex: +223 70 00 00 00"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (pour Portail Enseignant)</label>
                          <input 
                            type="email" 
                            value={newTeacherEmail}
                            onChange={(e) => setNewTeacherEmail(e.target.value)}
                            placeholder="Ex: prof.diallo@gmail.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Salaire Mensuel (FCFA)</label>
                          <input 
                            type="number" 
                            value={newTeacherSalary}
                            onChange={(e) => setNewTeacherSalary(e.target.value)}
                            placeholder="Ex: 75000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter l'enseignant
                        </button>
                      </form>
                    </div>

                    {/* Teacher List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Liste des Enseignants</h2>
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                          {teachers.length} Enseignants
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                              <th className="px-6 py-4">Nom / Email</th>
                              <th className="px-6 py-4">Matière</th>
                              <th className="px-6 py-4">Contact</th>
                              <th className="px-6 py-4">Salaire</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {teachers.map((teacher) => (
                              <motion.tr 
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={teacher.id} 
                                className="hover:bg-slate-50 transition-colors group"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                      {teacher.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-900">{teacher.name}</p>
                                      <p className="text-[10px] text-slate-400 font-medium">{teacher.email || 'Aucun email'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-slate-600">{teacher.subject}</span>
                                </td>
                                <td className="px-6 py-4">
                                  {teacher.contact ? (
                                    <a href={`tel:${teacher.contact}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
                                      <Phone className="w-3 h-3" />
                                      {teacher.contact}
                                    </a>
                                  ) : (
                                    <span className="text-sm text-slate-300 italic">Non spécifié</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-600">{teacher.salary ? `${teacher.salary.toLocaleString()} F` : 'N/A'}</td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => removeTeacher(teacher.id)}
                                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Admin Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        Nouveau Personnel
                      </h2>
                      <form onSubmit={handleAddAdmin} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom Complet</label>
                          <input 
                            type="text" 
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            placeholder="Ex: Mme. Traoré"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fonction</label>
                          <input 
                            type="text" 
                            value={newAdminRole}
                            onChange={(e) => setNewAdminRole(e.target.value)}
                            placeholder="Ex: Secrétaire"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact</label>
                          <input 
                            type="text" 
                            value={newAdminContact}
                            onChange={(e) => setNewAdminContact(e.target.value)}
                            placeholder="Ex: +223 70 00 00 00"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email (Portail Secrétaire)</label>
                          <input 
                            type="email" 
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            placeholder="Ex: mme.traore@gmail.com"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter au personnel
                        </button>
                      </form>
                    </div>

                    {/* Admin List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Personnel Administratif</h2>
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                          {adminStaff.length} Personnes
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                              <th className="px-6 py-4">Nom</th>
                              <th className="px-6 py-4">Fonction</th>
                              <th className="px-6 py-4">Contact</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {adminStaff.map((staff) => (
                              <motion.tr 
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={staff.id} 
                                className="hover:bg-slate-50 transition-colors group"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                                      {staff.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-900">{staff.name}</p>
                                      {staff.email && <p className="text-[10px] text-slate-400 font-semibold">{staff.email}</p>}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-slate-600">{staff.staffRole || staff.subject || staff.role}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                  {staff.contact ? (
                                    <a href={`tel:${staff.contact}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium">
                                      <Phone className="w-3 h-3 text-blue-400" />
                                      {staff.contact}
                                    </a>
                                  ) : (
                                    <span className="text-sm text-slate-300 italic">Non spécifié</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => removeAdmin(staff.id)}
                                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
              } />

              <Route path="/grades" element={
                <motion.div
                  key="grades"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Notes & Bulletins</h1>
                    <p className="text-slate-500">Gérez les évaluations et générez des bulletins intelligents.</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <select 
                      value={selectedClassForGrades}
                      onChange={(e) => {
                        setSelectedClassForGrades(e.target.value);
                        setNewGradeStudentId('');
                        setNewGradeSubject('');
                      }}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                    >
                      <option value="">Toutes les Classes</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      {[
                        { id: 'input', label: 'Saisie', icon: Plus },
                        { id: 'configs', label: 'Coefficients', icon: Settings },
                        { id: 'rankings', label: 'Classement', icon: TrendingUp }
                      ].map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveGradesSubTab(sub.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeGradesSubTab === sub.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          <sub.icon className="w-3.5 h-3.5" />
                          {sub.label}
                        </button>
                      ))}
                    </div>

                    <label className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
                      <FileUp className="w-3.5 h-3.5" />
                      Importer Notes
                      <input 
                        type="file" 
                        accept=".xlsx, .xls" 
                        className="hidden" 
                        onChange={handleImportGradesExcel} 
                      />
                    </label>

                    <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
                      <Download className="w-3.5 h-3.5" />
                      Importer Bulletins (Excel)
                      <input 
                        type="file" 
                        accept=".xlsx, .xls" 
                        className="hidden" 
                        onChange={handleImportBulletinsExcel} 
                      />
                    </label>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      <Sparkles className="w-3" />
                      <span>Diagnostic Pédagogique Actif</span>
                    </div>
                  </div>
                </div>

                {activeGradesSubTab === 'input' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                      <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-500" />
                        Saisir une Note
                      </h2>
                    <form onSubmit={handleAddGrade} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Élève</label>
                        <select 
                          value={newGradeStudentId}
                          onChange={(e) => {
                            setNewGradeStudentId(e.target.value);
                            setNewGradeSubject('');
                            setNewGradeCoefficient('2');
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                          required
                        >
                          <option value="">Sélectionner un élève</option>
                          {students.filter(s => !selectedClassForGrades || s.class === selectedClassForGrades).map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Matière</label>
                        <select 
                          value={newGradeSubject}
                          onChange={(e) => {
                            const sub = e.target.value;
                            setNewGradeSubject(sub);
                            const student = students.find(s => s.id === newGradeStudentId);
                            const subjects = getSubjectsForClass(student?.class || selectedClassForGrades);
                            const cfg = subjects.find(c => c.name === sub);
                            if (cfg) setNewGradeCoefficient(cfg.coefficient.toString());
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                        >
                          <option value="">Sélectionner une matière</option>
                          {(() => {
                            const student = students.find(s => s.id === newGradeStudentId);
                            const subjects = getSubjectsForClass(student?.class || selectedClassForGrades);
                            return subjects.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ));
                          })()}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Note</label>
                          <input 
                            type="number" 
                            step="0.25"
                            value={newGradeScore}
                            onChange={(e) => setNewGradeScore(e.target.value)}
                            placeholder="Ex: 14.5"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sur /</label>
                          <input 
                            type="number" 
                            value={newGradeMaxScore}
                            onChange={(e) => setNewGradeMaxScore(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Coeff</label>
                          <input 
                            type="number" 
                            value={newGradeCoefficient}
                            onChange={(e) => setNewGradeCoefficient(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Période</label>
                        <select 
                          value={newGradeTerm}
                          onChange={(e) => setNewGradeTerm(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                        >
                          <option value="1er Trimestre">1er Trimestre</option>
                          <option value="2ème Trimestre">2ème Trimestre</option>
                          <option value="3ème Trimestre">3ème Trimestre</option>
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Enregistrer la note
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Liste des Élèves & Bulletins IA</h2>
                        <div className="flex gap-2">
                           <select 
                             value={newGradeTerm}
                             onChange={(e) => setNewGradeTerm(e.target.value)}
                             className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                           >
                              <option value="Trimestre 1">Trimestre 1</option>
                              <option value="Trimestre 2">Trimestre 2</option>
                              <option value="Trimestre 3">Trimestre 3</option>
                           </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                              <th className="px-6 py-4">Élève</th>
                              <th className="px-6 py-4">Classe</th>
                              <th className="px-6 py-4">Moyenne</th>
                              <th className="px-6 py-4 text-right">Bulletin IA</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {students.filter(s => !selectedClassForGrades || s.class === selectedClassForGrades).map((student) => {
                              const studentGrades = grades.filter(g => g.studentId === student.id && g.term === newGradeTerm);
                              const subjects = getSubjectsForClass(student.class);
                              const { overallAverage } = calculateDetailedAverages(studentGrades, subjects);
                              const average = overallAverage > 0 ? overallAverage.toFixed(2) : '0.00';
                              
                              return (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                                  <td className="px-6 py-4 text-sm text-slate-500">{student.class}</td>
                                  <td className="px-6 py-4">
                                    <span className={`text-sm font-bold ${parseFloat(average) >= 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {average} / 20
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button 
                                        onClick={() => {
                                          setSelectedStudentForReport(student);
                                          setShowManualReport(true);
                                        }}
                                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg transition-all"
                                        title="Voir le bulletin pro"
                                      >
                                        <Printer className="w-3 h-3" />
                                        Bulletin
                                      </button>
                                      <button 
                                        onClick={() => handleGenerateReport(student)}
                                        disabled={isGeneratingReport}
                                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                                        title="Analyse IA"
                                      >
                                        {isGeneratingReport && selectedStudentForReport?.id === student.id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Sparkles className="w-3 h-3" />
                                        )}
                                        IA
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => {
                            const classStudents = students.filter(s => !selectedClassForGrades || s.class === selectedClassForGrades);
                            if (classStudents.length > 0) {
                              setBulkBulletinStudents(classStudents);
                              setShowManualReport(true);
                            } else {
                              alert("Aucun élève à imprimer dans cette classe.");
                            }
                          }}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-blue-500/20"
                        >
                          <Printer className="w-4 h-4" />
                          Imprimer Tous les Bulletins ({students.filter(s => !selectedClassForGrades || s.class === selectedClassForGrades).length})
                        </button>
                      </div>
                    </div>

                    {/* Recent Grades List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg">Dernières Notes Saisies</h2>
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-slate-400">Derniers 15 enregistrements</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Élève</th>
                              <th className="px-6 py-4">Matière</th>
                              <th className="px-6 py-4">Note</th>
                              <th className="px-6 py-4">Période</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[...grades]
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .filter(g => !selectedClassForGrades || students.find(s => s.id === g.studentId)?.class === selectedClassForGrades)
                              .slice(0, 15)
                              .map((grade) => (
                              <tr key={grade.id} className="hover:bg-slate-50 transition-all text-sm group">
                                <td className="px-6 py-3 text-slate-400 text-xs font-medium">
                                   {new Date(grade.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-3 font-bold text-slate-900">{grade.studentName}</td>
                                <td className="px-6 py-3 text-slate-600">{grade.subject}</td>
                                <td className="px-6 py-3 font-black text-slate-900">{grade.score} / {grade.maxScore}</td>
                                <td className="px-6 py-3">
                                   <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{grade.term}</span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <button
                                    onClick={() => handleRemoveGrade(grade.id, `schools/${schoolId}/grades/${grade.id}`)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                                    title="Supprimer la note"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Supprimer</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Manual Report Card Modal */}
                    {(showManualReport || bulkBulletinStudents) && (
                      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-slate-100 rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden max-w-5xl w-full my-8 print:my-0 print:shadow-none print:bg-white print-content"
                        >
                           {/* Modal Controls */}
                           <div className="bg-white p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                              <div className="flex flex-col gap-1">
                                 <h3 className="font-black text-slate-900">Génération de Bulletin</h3>
                                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    {bulkBulletinStudents ? `Impression en cours : ${bulkBulletinStudents.length} élèves` : `Impression pour : ${selectedStudentForReport?.name}`}
                                 </p>
                              </div>
                              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                                 {[
                                   { id: 'classic', label: 'Classique' },
                                   { id: 'modern', label: 'Moderne' },
                                   { id: 'minimal', label: 'Minimal' }
                                 ].map(t => (
                                   <button 
                                     key={t.id}
                                     onClick={() => setBulletinTemplate(t.id as any)}
                                     className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${bulletinTemplate === t.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                                   >
                                     {t.label}
                                   </button>
                                 ))}
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={handleDownloadBulletinPDF}
                                  disabled={isGeneratingBulletinPDF}
                                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                >
                                  {isGeneratingBulletinPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                  PDF
                                </button>
                                <button 
                                  onClick={() => {
                                    window.focus();
                                    setTimeout(() => window.print(), 100);
                                  }}
                                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                >
                                  <Printer className="w-4 h-4" />
                                  Imprimer
                                </button>
                                <button 
                                  onClick={() => {
                                    setShowManualReport(false);
                                    setBulkBulletinStudents(null);
                                  }}
                                  className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                           </div>

                           {/* Printable Content */}
                           <div id="bulletins-container" className="max-h-[80vh] overflow-y-auto bg-slate-200 p-8 print:p-0 print:max-h-none print:bg-white space-y-8">
                             {(bulkBulletinStudents || (selectedStudentForReport ? [selectedStudentForReport] : [])).map((student, i) => (
                               <div key={student.id} className="bulletin-page shadow-2xl print:shadow-none bg-white mx-auto print:break-after-page rounded-[2rem] overflow-hidden print:rounded-none" style={{ width: bulletinTemplate === 'minimal' ? '100%' : '210mm' }}>
                                 {bulletinTemplate === 'classic' && (
                                   <ClassicTemplate 
                                     student={student} 
                                     studentGrades={grades.filter(g => g.studentId === student.id && g.term === newGradeTerm)} 
                                     configs={getSubjectsForClass(student.class)}
                                     schoolInfo={schoolInfo} 
                                     term={newGradeTerm} 
                                     bulletins={bulletins}
                                     onUpdateBulletin={handleUpdateBulletin}
                                   />
                                 )}
                                 {bulletinTemplate === 'modern' && (
                                   <ModernTemplate 
                                     student={student} 
                                     studentGrades={grades.filter(g => g.studentId === student.id && g.term === newGradeTerm)} 
                                     configs={getSubjectsForClass(student.class)}
                                     schoolInfo={schoolInfo} 
                                     term={newGradeTerm} 
                                     bulletins={bulletins}
                                     onUpdateBulletin={handleUpdateBulletin}
                                   />
                                 )}
                                 {bulletinTemplate === 'minimal' && (
                                   <MinimalTemplate 
                                     student={student} 
                                     studentGrades={grades.filter(g => g.studentId === student.id && g.term === newGradeTerm)} 
                                     configs={getSubjectsForClass(student.class)}
                                     schoolInfo={schoolInfo} 
                                     term={newGradeTerm} 
                                     bulletins={bulletins}
                                     onUpdateBulletin={handleUpdateBulletin}
                                   />
                                 )}
                               </div>
                             ))}
                           </div>
                        </motion.div>
                      </div>
                    )}
                    {aiReport && selectedStudentForReport && (
                      <motion.div 
                        id="ai-report-section"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:shadow-none print:border-none max-w-5xl mx-auto print-content"
                      >
                        {/* Header Official */}
                        <div className="bg-white p-8 border-b-4 border-double border-slate-900 flex justify-between items-start">
                          <div className="text-center space-y-1">
                            <h4 className="font-bold text-sm uppercase tracking-tighter">République du Mali</h4>
                            <p className="text-[10px] font-medium italic">Un Peuple - Un But - Une Foi</p>
                            <div className="w-16 h-16 mx-auto my-2 bg-white rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                              {schoolInfo.logo ? (
                                <img 
                                  src={schoolInfo.logo} 
                                  alt="Logo school" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <GraduationCap className="w-8 h-8 text-slate-300" />
                              )}
                            </div>
                            <p className="text-[9px] uppercase font-bold leading-tight">Ministère de l'Éducation Nationale</p>
                          </div>

                          <div className="text-center flex-1 px-10">
                            <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 mb-1">{schoolInfo.name}</h2>
                            <p className="text-xs font-bold text-slate-500 uppercase">{schoolInfo.address}</p>
                            <div className="mt-4 inline-block border-2 border-slate-900 px-6 py-2">
                              <h3 className="text-lg font-black uppercase">Bulletin de Notes</h3>
                              <p className="text-xs font-bold">{newGradeTerm} - Année 2023-2024</p>
                            </div>
                          </div>

                          <div className="text-right space-y-2">
                            <div className="flex gap-2 print:hidden justify-end">
                              <button 
                                onClick={() => {
                                  window.focus();
                                  setTimeout(() => window.print(), 100);
                                }}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                <Printer className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => setAiReport(null)}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                <Plus className="w-5 h-5 rotate-45" />
                              </button>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identité de l'Élève</p>
                            <p className="text-xl font-black text-slate-900 uppercase">{selectedStudentForReport.name}</p>
                            <p className="text-sm font-bold text-slate-600">Classe : {selectedStudentForReport.class}</p>
                          </div>
                        </div>

                        <div className="p-8 bg-white">
                          {(() => {
                            try {
                              const data = typeof aiReport === 'string' ? JSON.parse(aiReport) : aiReport;
                              const studentGrades = grades.filter(g => g.studentId === selectedStudentForReport.id && g.term === newGradeTerm);
                              const totalPoints = studentGrades.reduce((acc, g) => acc + (g.score * g.coefficient), 0);
                              const totalCoeff = studentGrades.reduce((acc, g) => acc + g.coefficient, 0);
                              const generalAverage = totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : "0.00";

                              return (
                                <>
                                  <table className="w-full border-collapse border-2 border-slate-900 text-sm mb-8">
                                    <thead>
                                      <tr className="bg-slate-50">
                                        <th className="border-2 border-slate-900 p-3 text-left uppercase font-black text-xs">Disciplines</th>
                                        <th className="border-2 border-slate-900 p-3 text-center uppercase font-black text-xs w-16">Coeff</th>
                                        <th className="border-2 border-slate-900 p-3 text-center uppercase font-black text-xs w-24">Note / 20</th>
                                        <th className="border-2 border-slate-900 p-3 text-center uppercase font-black text-xs w-24">Pondérée</th>
                                        <th className="border-2 border-slate-900 p-3 text-left uppercase font-black text-xs">Appréciations des Professeurs</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {studentGrades.map((g, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                          <td className="border-2 border-slate-900 p-3 font-bold text-slate-900">{g.subject}</td>
                                          <td className="border-2 border-slate-900 p-3 text-center font-bold">{g.coefficient}</td>
                                          <td className="border-2 border-slate-900 p-3 text-center font-black text-lg">{g.score}</td>
                                          <td className="border-2 border-slate-900 p-3 text-center font-bold text-slate-600">{(g.score * g.coefficient).toFixed(1)}</td>
                                          <td className="border-2 border-slate-900 p-3 text-xs italic text-slate-700 leading-tight">
                                            {data.appreciations?.[g.subject] || "Travail satisfaisant dans l'ensemble."}
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="bg-slate-900 text-white">
                                        <td className="border-2 border-slate-900 p-3 font-black uppercase text-right" colSpan={3}>Moyenne Générale</td>
                                        <td className="border-2 border-slate-900 p-3 text-center font-black text-xl">{generalAverage}</td>
                                        <td className="border-2 border-slate-900 p-3 font-black uppercase text-center bg-white text-slate-900">
                                          {data.decision || "A AJOURNER"}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-4">
                                      <div className="border-2 border-slate-900 p-4 rounded-lg bg-slate-50">
                                        <h4 className="text-xs font-black uppercase mb-2 flex items-center gap-2">
                                          <Clock className="w-4 h-4" /> Assiduité & Conduite
                                        </h4>
                                        <p className="text-sm text-slate-700 leading-relaxed italic">
                                          {data.attendanceComment}
                                        </p>
                                      </div>
                                      <div className="border-2 border-slate-900 p-4 rounded-lg">
                                        <h4 className="text-xs font-black uppercase mb-2 flex items-center gap-2">
                                          <MessageSquare className="w-4 h-4" /> Appréciation Globale
                                        </h4>
                                        <p className="text-sm text-slate-900 font-medium leading-relaxed">
                                          {data.globalComment}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="border-2 border-slate-900 p-4 rounded-lg bg-blue-50/30">
                                      <h4 className="text-xs font-black uppercase mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" /> Recommandations du Conseil
                                      </h4>
                                      <p className="text-sm text-slate-800 leading-relaxed">
                                        {data.recommendations}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              );
                            } catch (e) {
                              return (
                                <div className="p-10 text-center space-y-4">
                                  <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                                    <ShieldCheck className="w-8 h-8" />
                                  </div>
                                  <h3 className="text-xl font-bold text-slate-900">Format de Bulletin Invalide</h3>
                                  <p className="text-slate-500 max-w-md mx-auto">
                                    L'IA a généré un contenu qui ne peut pas être affiché dans le format officiel. 
                                    Veuillez réessayer la génération.
                                  </p>
                                  <div className="p-4 bg-slate-50 rounded-xl text-left text-xs font-mono overflow-auto max-h-40">
                                    {aiReport}
                                  </div>
                                </div>
                              );
                            }
                          })()}

                          {/* Signature Area */}
                          <div className="mt-12 pt-10 border-t-4 border-double border-slate-900 grid grid-cols-3 gap-10">
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase mb-16">Signature des Parents</p>
                              <div className="h-px bg-slate-300 w-full mb-2"></div>
                              <p className="text-[9px] text-slate-400 italic">Lu et approuvé</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase mb-16">Le Titulaire</p>
                              <div className="h-px bg-slate-300 w-full"></div>
                            </div>
                            <div className="text-center relative">
                              <p className="text-[10px] font-black uppercase mb-16">Le Directeur : {schoolInfo.director}</p>
                              <div className="h-px bg-slate-300 w-full mb-2"></div>
                              <p className="text-[9px] text-slate-400 italic">Cachet de l'Établissement</p>
                              <div className="absolute top-10 right-0 w-24 h-24 border-4 border-rose-600/20 rounded-full flex items-center justify-center rotate-12 pointer-events-none print:opacity-50">
                                <p className="text-[8px] font-black text-rose-600/30 uppercase text-center leading-tight">
                                  {schoolInfo.name}<br/>DIRECTION
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-900 text-white flex justify-between items-center print:hidden border-t border-slate-800">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-blue-400" />
                              <span className="text-[10px] font-bold tracking-widest uppercase">Document Certifié par School Core AI</span>
                            </div>
                            <button 
                              onClick={() => {
                                window.focus();
                                setTimeout(() => window.print(), 100);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Imprimer l'Analyse
                            </button>
                          </div>
                          <button 
                            onClick={() => setAiReport(null)}
                            className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full transition-all"
                          >
                            Fermer
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {activeGradesSubTab === 'configs' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h2 className="font-bold text-lg">Configuration des Matières et Coefficients</h2>
                      <p className="text-xs text-slate-500">Définissez les poids pour le calcul des moyennes.</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                      <Plus className="w-4 h-4" /> Ajouter une matière
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                          <th className="px-6 py-4">Matière</th>
                          <th className="px-6 py-4">Coefficient</th>
                          <th className="px-6 py-4">Catégorie</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {getSubjectsForClass(selectedClassForGrades).map(config => (
                          <tr key={config.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">{config.name}</td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-600">
                              <span className="bg-slate-100 px-3 py-1 rounded-lg">x {config.coefficient}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                                config.category === 'Sciences' ? 'bg-blue-100 text-blue-700' :
                                config.category === 'Lettres' ? 'bg-orange-100 text-orange-700' :
                                config.category === 'Langues' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {config.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                                <Settings className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeGradesSubTab === 'rankings' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {students.filter(s => !selectedClassForGrades || s.class === selectedClassForGrades).slice(0, 3).map((s, i) => {
                      const subjects = getSubjectsForClass(s.class);
                      const { overallAverage } = calculateDetailedAverages(grades.filter(g => g.studentId === s.id && g.term === newGradeTerm), subjects);
                      return (
                        <div key={s.id} className={`p-6 rounded-3xl border ${i === 0 ? 'bg-amber-50 border-amber-100 shadow-xl shadow-amber-500/10' : 'bg-white border-slate-100'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${i === 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              {i + 1}
                            </div>
                            <TrendingUp className={`w-5 h-5 ${i === 0 ? 'text-amber-500' : 'text-slate-300'}`} />
                          </div>
                          <h3 className="font-black text-slate-900 uppercase truncate">{s.name}</h3>
                          <p className="text-xs font-bold text-slate-500 mb-4">{s.class}</p>
                          <div className="flex justify-between items-end">
                            <span className="text-2xl font-black text-slate-900">{overallAverage.toFixed(2)}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Points cumulés</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <h2 className="font-black text-slate-900 uppercase tracking-tight">Tableau d'Honneur - {newGradeTerm}</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedClassForGrades || 'Toutes les classes'}</p>
                      </div>
                      <button 
                        onClick={handleGenerateRankings}
                        disabled={isGeneratingRankings || !selectedClassForGrades}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
                          isGeneratingRankings 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20 active:scale-95'
                        }`}
                      >
                        {isGeneratingRankings ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Award className="w-4 h-4" />
                        )}
                        {isGeneratingRankings ? 'Génération...' : 'Générer Rangs Officiels'}
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                            <th className="px-6 py-4">Rang</th>
                            <th className="px-6 py-4">Élève</th>
                            <th className="px-6 py-4">Classe</th>
                            <th className="px-6 py-4">Moyenne</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {students
                            .filter(s => !selectedClassForGrades || s.class === selectedClassForGrades)
                            .map(s => {
                              const subjects = getSubjectsForClass(s.class);
                              const { overallAverage, decision } = calculateDetailedAverages(grades.filter(g => g.studentId === s.id && g.term === newGradeTerm), subjects);
                              return { ...s, average: overallAverage, decision };
                            })
                            .sort((a, b) => b.average - a.average)
                            .map((s, idx) => (
                              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-black text-slate-400">#{idx + 1}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{s.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{s.class}</td>
                                <td className="px-6 py-4">
                                  <span className={`text-sm font-black ${s.average >= 12 ? 'text-emerald-500' : s.average >= 10 ? 'text-blue-500' : 'text-rose-500'}`}>
                                    {s.average.toFixed(2)}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                                    s.decision === 'Admis' ? 'bg-emerald-100 text-emerald-700' :
                                    s.decision === 'Admis avec rachat' ? 'bg-blue-100 text-blue-700' :
                                    'bg-rose-100 text-rose-700'
                                  }`}>
                                    {s.decision}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              </motion.div>
              } />

              <Route path="/schedule" element={
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="pb-20"
                >
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Emploi du Temps</h1>
                    <p className="text-slate-500">Organisation visuelle des cours par classe.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setEditingScheduleEntry(null);
                        setNewScheduleClassId(selectedClassForSchedule || (classes[0]?.id || ''));
                        setNewScheduleSubject('');
                        setNewScheduleRoom('');
                        setShowScheduleModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Planifier un cours
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Imprimer
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-slate-50/30">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Filtrer par Classe</p>
                        <select 
                          value={selectedClassForSchedule}
                          onChange={(e) => setSelectedClassForSchedule(e.target.value)}
                          className="bg-transparent border-none p-0 text-sm font-black text-slate-900 focus:ring-0 outline-none cursor-pointer"
                        >
                          <option value="">Toutes les classes</option>
                          {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Cours Occupé</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-dashed border-slate-200 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Emplacement Libre</span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-6 border border-slate-100 bg-slate-50 shadow-[inset_-1px_0_0_0_#f1f5f9] text-[10px] font-black uppercase text-slate-400 w-32 sticky left-0 z-10">
                            Heures
                          </th>
                          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => (
                            <th key={day} className="p-6 border border-slate-100 bg-slate-50 text-[10px] font-black uppercase text-slate-500 min-w-[200px]">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(hour => (
                          <tr key={hour} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="p-6 border border-slate-100 text-center sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors">
                              <span className="text-xs font-black text-slate-400 tabular-nums">{hour}</span>
                            </td>
                            {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => {
                              const entriesAtSlot = schedule.filter(s => 
                                s.day === day && 
                                (!selectedClassForSchedule || s.classId === selectedClassForSchedule) &&
                                s.startTime <= hour &&
                                s.endTime > hour
                              );

                              return (
                                <td key={day} className="p-3 border border-slate-100 align-top relative min-h-[100px]">
                                  <div className="space-y-3">
                                    {entriesAtSlot.length > 0 ? (
                                      entriesAtSlot.map((entry) => {
                                        const teacher = teachers.find(t => t.id === entry.teacherId);
                                        return (
                                          <motion.div 
                                            key={entry.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={() => {
                                              setEditingScheduleEntry(entry);
                                              setNewScheduleClassId(entry.classId);
                                              setNewScheduleTeacherId(entry.teacherId);
                                              setNewScheduleSubject(entry.subject);
                                              setNewScheduleDay(entry.day);
                                              setNewScheduleStartTime(entry.startTime);
                                              setNewScheduleEndTime(entry.endTime);
                                              setNewScheduleRoom(entry.room);
                                              setShowScheduleModal(true);
                                            }}
                                            className="group/entry bg-blue-50/80 hover:bg-blue-100 border-l-4 border-blue-500 p-4 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
                                          >
                                            <div className="absolute top-0 right-0 p-1 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteScheduleEntry(entry.id);
                                                }}
                                                className="p-1 px-2 text-[10px] font-black text-rose-500 bg-white rounded-lg shadow-sm border border-rose-100"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                            <div className="flex justify-between items-start mb-2">
                                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{entry.classId}</span>
                                              <span className="text-[10px] font-bold text-blue-500 tabular-nums">{entry.startTime} - {entry.endTime}</span>
                                            </div>
                                            <p className="text-sm font-black text-blue-900 leading-tight mb-2 uppercase">{entry.subject}</p>
                                            <div className="flex items-center gap-2 text-blue-700">
                                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black">
                                                {teacher?.name?.charAt(0)}
                                              </div>
                                              <div className="min-w-0">
                                                <p className="text-[10px] font-bold truncate">{teacher?.name}</p>
                                                <p className="text-[9px] font-medium opacity-60 flex items-center gap-1">
                                                  <MapPin className="w-2.5 h-2.5" />
                                                  {entry.room || 'Salle non spécifiée'}
                                                </p>
                                              </div>
                                            </div>
                                          </motion.div>
                                        );
                                      })
                                    ) : (
                                      <div 
                                        onClick={() => {
                                          setEditingScheduleEntry(null);
                                          setNewScheduleDay(day as any);
                                          setNewScheduleStartTime(hour);
                                          // Default 1h duration
                                          const [h, m] = hour.split(':').map(Number);
                                          const endH = h + 1;
                                          setNewScheduleEndTime(`${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                                          setNewScheduleClassId(selectedClassForSchedule || (classes[0]?.id || ''));
                                          setShowScheduleModal(true);
                                        }}
                                        className="h-20 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center group/empty cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                                      >
                                        <div className="flex flex-col items-center gap-1 opacity-0 group-hover/empty:opacity-100 transition-opacity">
                                          <Plus className="w-4 h-4 text-blue-400" />
                                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Réserver</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <ShieldCheck className="w-24 h-24" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 relative z-10">Aide à la planification</h3>
                    <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                      Notre système détecte automatiquement les conflits d'emploi du temps. Vous ne pouvez pas affecter un enseignant ou une salle à deux cours différents en même temps.
                    </p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-blue-600">
                      <Clock className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">Ponctualité</h4>
                      <p className="text-xs text-blue-700 font-medium">L'emploi du temps est synchronisé en temps réel sur le portail des enseignants.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              } />

              <Route path="/billing" element={
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestion Financière</h1>
                    <p className="text-slate-500 font-medium">Contrôle complet des flux de trésorerie.</p>
                  </div>
                  
                  <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto max-w-full">
                    {[
                      { id: 'revenues', label: 'Recettes', icon: CreditCard },
                      { id: 'expenses', label: 'Dépenses', icon: Trash2 },
                      { id: 'profit', label: 'Rentabilité', icon: TrendingUp },
                      { id: 'debts', label: 'Impayés', icon: Clock }
                    ].map((tab) => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveFinancesTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFinancesTab === tab.id ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={exportTransactionsToExcel}
                      className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Encaissé</p>
                    <p className="text-2xl font-black text-emerald-600">{totalFinancialStats.collected.toLocaleString()} F</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Dépenses</p>
                    <p className="text-2xl font-black text-rose-600">{totalFinancialStats.expenses.toLocaleString()} F</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Solde Actuel</p>
                    <p className="text-2xl font-black text-blue-600">{totalFinancialStats.profit.toLocaleString()} F</p>
                  </div>
                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Reste à Recouvrer</p>
                    <p className="text-2xl font-black text-rose-600">{totalFinancialStats.debt.toLocaleString()} F</p>
                  </div>
                </div>

                {activeFinancesTab === 'revenues' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                      <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
                        <Plus className="w-5 h-5 text-blue-500" />
                        Paiement Scolarité
                      </h2>
                      <form onSubmit={handleAddTransaction} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Élève</label>
                          <select 
                            value={newPaymentStudentId}
                            onChange={(e) => setNewPaymentStudentId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="">Sélectionner un élève</option>
                            {students.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Montant (FCFA)</label>
                          <input 
                            type="number" 
                            value={newPaymentAmount}
                            onChange={(e) => setNewPaymentAmount(e.target.value)}
                            placeholder="Ex: 50000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Mode</label>
                          <select 
                            value={newPaymentMethod}
                            onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="Espèces">Espèces</option>
                            <option value="Orange Money">Orange Money</option>
                            <option value="Moov Money">Moov Money</option>
                            <option value="Wave Money">Wave Money</option>
                            <option value="Autre">Autre</option>
                          </select>
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-slate-900/10 text-[10px] uppercase tracking-widest"
                        >
                          Enregistrer l'Encaissement
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                        <h2 className="font-black text-slate-900 uppercase">Journal des Recettes</h2>
                        <div className="flex p-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                          {['all', 'month'].map(p => (
                            <button 
                              key={p}
                              onClick={() => setBillingFilter(p as any)}
                              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${billingFilter === p ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                            >
                              {p === 'all' ? 'Tout' : 'Ce mois'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                              <th className="px-6 py-4">Élève</th>
                              <th className="px-6 py-4">Montant</th>
                              <th className="px-6 py-4">Méthode</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {filteredTransactions.map((t) => (
                              <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-4">
                                  <p className="text-sm font-bold text-slate-900">{t.studentName}</p>
                                </td>
                                <td className="px-6 py-4 text-sm font-black text-slate-900">{t.amount.toLocaleString()} F</td>
                                <td className="px-6 py-4">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.method}</span>
                                </td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-400">{t.date}</td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => { setSelectedTransactionForReceipt(t); setShowReceipt(true); }}
                                    className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeFinancesTab === 'expenses' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                      <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
                        <Plus className="w-5 h-5 text-rose-500" />
                        Nouvelle Dépense
                      </h2>
                      <form onSubmit={handleAddExpense} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Catégorie</label>
                          <select 
                            value={newExpenseCategory}
                            onChange={(e) => setNewExpenseCategory(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="Salaire">Salaires Profs</option>
                            <option value="Loyer">Loyer Établissement</option>
                            <option value="Eau/Électricité">Eau & Électricité</option>
                            <option value="Fournitures">Fournitures & Matériel</option>
                            <option value="Autre">Autres Charges</option>
                          </select>
                        </div>
                        {newExpenseCategory === 'Salaire' && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Choisir l'Enseignant</label>
                            <select 
                              value={selectedExpenseTeacherId}
                              onChange={(e) => {
                                const teacherId = e.target.value;
                                setSelectedExpenseTeacherId(teacherId);
                                const teacher = teachers.find(t => t.id === teacherId);
                                if (teacher && teacher.salary) {
                                  setNewExpenseAmount(teacher.salary.toString());
                                  setNewExpenseDescription(`Salaire de ${teacher.name}`);
                                }
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                            >
                              <option value="">Sélectionner un prof</option>
                              {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                              ))}
                            </select>
                          </div>
                        )}
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Montant (FCFA)</label>
                          <input 
                            type="number" 
                            value={newExpenseAmount}
                            onChange={(e) => setNewExpenseAmount(e.target.value)}
                            placeholder="Ex: 150000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Description</label>
                          <textarea 
                            value={newExpenseDescription}
                            onChange={(e) => setNewExpenseDescription(e.target.value)}
                            placeholder="Ex: Facture EDM Mars 2024"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all h-24 resize-none"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-rose-900/10 text-[10px] uppercase tracking-widest"
                        >
                          Valider la sortie de fonds
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                        <h2 className="font-black text-slate-900 uppercase">Journal des Dépenses</h2>
                        <div className="bg-rose-50 text-rose-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
                          Total: {totalFinancialStats.expenses.toLocaleString()} F
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                              <th className="px-6 py-4">Libellé</th>
                              <th className="px-6 py-4">Catégorie</th>
                              <th className="px-6 py-4">Montant</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((e) => (
                              <tr key={e.id} className="hover:bg-slate-50/30 transition-colors">
                                <td className="px-6 py-4">
                                  <p className="text-sm font-bold text-slate-900">{e.description || 'Sans description'}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-600">{e.category}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-black text-rose-600">-{e.amount.toLocaleString()} F</td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-400">{e.date}</td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => handleDeleteExpense(e.id)}
                                    className="p-2 text-slate-300 hover:text-rose-600 transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeFinancesTab === 'profit' && (
                  <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                      <div className="relative z-10">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Bilan de Profitabilité</h2>
                        <p className="text-slate-500 font-medium mb-10 italic">Analyse automatique des gains et pertes réels de l'établissement.</p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-2 h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { name: 'Recettes', value: totalFinancialStats.collected, color: '#10b981' },
                                { name: 'Dépenses', value: totalFinancialStats.expenses, color: '#f43f5e' },
                                { name: 'Profit Brut', value: totalFinancialStats.profit, color: '#3b82f6' }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} tickFormatter={v => `${v/1000}k`} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={60}>
                                  {
                                    [
                                      { color: '#10b981' },
                                      { color: '#f43f5e' },
                                      { color: '#3b82f6' }
                                    ].map((entry, index) => (
                                      <Cell key={index} fill={entry.color} />
                                    ))
                                  }
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="space-y-6">
                            <div className={`p-6 rounded-3xl border ${totalFinancialStats.profit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                              <h3 className="text-[10px] font-black uppercase tracking-widest mb-2">Statut Financier</h3>
                              <p className={`text-2xl font-black ${totalFinancialStats.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {totalFinancialStats.profit >= 0 ? 'EN BÉNÉFICE' : 'EN DÉFICIT'}
                              </p>
                              <p className="text-xs font-bold mt-1 text-slate-500 italic">Basé sur les données de ce mois</p>
                            </div>
                            
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                              <h3 className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Taux de Marge</h3>
                              <p className="text-2xl font-black text-slate-900">
                                {totalFinancialStats.collected > 0 ? ((totalFinancialStats.profit / totalFinancialStats.collected) * 100).toFixed(1) : 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFinancesTab === 'debts' && (
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/10">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Rappels de Paiement</h2>
                        <p className="text-slate-500 font-medium italic">Parents en retard de scolarité.</p>
                      </div>
                      <div className="bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100">
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Global Restant : {totalFinancialStats.debt.toLocaleString()} F</span>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                            <th className="px-8 py-5">Élève & Parent</th>
                            <th className="px-6 py-5">Scolarité Totale</th>
                            <th className="px-6 py-5">Déjà Payé</th>
                            <th className="px-6 py-5">Reste à payer</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {students.map(student => {
                            const studentPaid = transactions.filter(t => t.studentId === student.id).reduce((acc, t) => acc + t.amount, 0);
                            const debt = (student.totalFees || 0) - studentPaid;
                            if (debt <= 0) return null;

                            return (
                              <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-lg">
                                      {student.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-black text-slate-900 leading-tight">{student.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{student.parentName || 'Parent Inconnu'} • {student.class}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-6 text-sm font-bold text-slate-600">{(student.totalFees || 0).toLocaleString()} F</td>
                                <td className="px-6 py-6 text-sm font-bold text-emerald-600">{studentPaid.toLocaleString()} F</td>
                                <td className="px-6 py-6">
                                   <div className="flex flex-col gap-1">
                                      <p className="text-sm font-black text-rose-600">{debt.toLocaleString()} F</p>
                                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-rose-500" 
                                          style={{ width: `${(debt / (student.totalFees || 1)) * 100}%` }} 
                                        />
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <button 
                                    onClick={() => handleSendParentSMS(student)}
                                    className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${subscriptionPlan === 'free' ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white shadow-sm'}`}
                                  >
                                    {subscriptionPlan === 'free' ? 'Rappel (Pro)' : 'Relancer Directement'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
              } />

              <Route path="/subscription" element={
                <motion.div
                  key="subscription"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-6xl mx-auto"
                >
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-black text-slate-900 mb-4">Propulsez votre établissement</h1>
                  <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    Choisissez le plan qui correspond à la taille de votre école et profitez d'une gestion simplifiée et moderne.
                  </p>
                  
                  <div className="mt-8 inline-flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
                    <button 
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Mensuel
                    </button>
                    <button 
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Annuel <span className="ml-1 text-[10px] text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">-25%</span>
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckSquare className="w-4 h-4" />
                    <span>1 mois d'essai gratuit sur tous les plans</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {/* Free Plan */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Gratuit</h3>
                      <p className="text-slate-500 text-sm">Pour tester les bases de SchoolCore.</p>
                    </div>
                    <div className="mb-8">
                      <span className="text-4xl font-black text-slate-900">0 FCFA</span>
                      <span className="text-slate-400 text-sm ml-2">/ mois</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "Jusqu'à 50 élèves",
                        "Gestion des classes",
                        "Tableau de bord basique",
                        "Support communautaire"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <CheckSquare className="w-3 h-3 text-slate-400" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => {
                        setSubscriptionPlan('free');
                        localStorage.setItem('school_core_plan', 'free');
                      }}
                      className={`w-full py-4 rounded-2xl font-bold transition-all ${subscriptionPlan === 'free' ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                      {subscriptionPlan === 'free' ? 'Plan Actuel' : 'Sélectionner'}
                    </button>
                  </div>

                  {/* Premium Plan */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col relative">
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Premium</h3>
                      <p className="text-slate-500 text-sm">Idéal pour les écoles en croissance.</p>
                    </div>
                    <div className="mb-8">
                      <span className="text-4xl font-black text-slate-900">
                        {billingCycle === 'monthly' ? '15 000' : '135 000'} FCFA
                      </span>
                      <span className="text-slate-400 text-sm ml-2">/ {billingCycle === 'monthly' ? 'mois' : 'an'}</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "Jusqu'à 300 élèves",
                        "Bulletins IA illimités",
                        "Gestion des présences",
                        "Suivi des paiements",
                        "Support par email"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <CheckSquare className="w-3 h-3 text-blue-500" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => {
                        if (subscriptionPlan !== 'premium') {
                          setSelectedPlanForPayment('premium');
                        }
                      }}
                      className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${subscriptionPlan === 'premium' ? 'bg-blue-100 text-blue-500 cursor-default' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'}`}
                    >
                      {subscriptionPlan === 'premium' ? 'Plan Actuel' : 'Choisir Premium'}
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Plus Populaire
                    </div>
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
                      <p className="text-slate-400 text-sm">La solution complète sans limites.</p>
                    </div>
                    <div className="mb-8">
                      <span className="text-4xl font-black text-white">
                        {billingCycle === 'monthly' ? '25 000' : '225 000'} FCFA
                      </span>
                      <span className="text-slate-500 text-sm ml-2">/ {billingCycle === 'monthly' ? 'mois' : 'an'}</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "Élèves illimités",
                        "SMS automatiques illimités",
                        "Gestion financière avancée",
                        "Multi-utilisateurs (Secrétaires)",
                        "Support prioritaire 24/7",
                        "Formation personnalisée"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <CheckSquare className="w-3 h-3 text-blue-400" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => {
                        if (subscriptionPlan !== 'pro') {
                          setSelectedPlanForPayment('pro');
                        }
                      }}
                      className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${subscriptionPlan === 'pro' ? 'bg-white/10 text-white cursor-default' : 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10'}`}
                    >
                      {subscriptionPlan === 'pro' ? 'Plan Actuel' : 'Choisir Pro'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-6 mb-12">
                  {activePaymentRequest && (
                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">Vérification en cours</h3>
                          <p className="text-sm text-slate-500">Votre demande d'abonnement <span className="font-bold uppercase">{activePaymentRequest.plan}</span> est en attente de confirmation.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">En attente</span>
                      </div>
                    </div>
                  )}

                  <div id="payment-methods" className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all duration-500 ${selectedPlanForPayment ? 'ring-4 ring-blue-500/20 border-blue-200' : ''}`}>
                    {!selectedPlanForPayment && !selectedPaymentMethod ? (
                      <div className="text-center py-10">
                        <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Prêt à passer à l'étape supérieure ?</h3>
                        <p className="text-slate-500 text-sm max-w-md mx-auto">Choisissez un plan ci-dessus pour accéder aux fonctionnalités professionnelles de SchoolCore.</p>
                      </div>
                    ) : selectedPlanForPayment && !selectedPaymentMethod ? (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">Mode de Paiement</h3>
                            <p className="text-slate-500 text-sm">Sélectionnez votre solution mobile préférée pour le règlement de <span className="font-bold text-slate-900">{selectedPlanForPayment === 'premium' ? (billingCycle === 'monthly' ? '15 000' : '135 000') : (billingCycle === 'monthly' ? '25 000' : '225 000')} FCFA</span></p>
                          </div>
                          <button onClick={() => setSelectedPlanForPayment(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: 'orange', name: 'Orange Money', color: 'orange' },
                            { id: 'moov', name: 'Moov Money', color: 'blue' },
                            { id: 'wave', name: 'Wave', color: 'cyan' }
                          ].map((m) => (
                            <button 
                              key={m.id}
                              onClick={() => setSelectedPaymentMethod(m.id as any)}
                              className="group p-6 rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left"
                            >
                              <div className={`w-12 h-12 rounded-xl bg-${m.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Smartphone className={`w-6 h-6 text-${m.color}-500`} />
                              </div>
                              <h4 className="font-bold text-slate-900">{m.name}</h4>
                              <p className="text-xs text-slate-400 mt-1">Paiement mobile sécurisé</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : selectedPlanForPayment && selectedPaymentMethod ? (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <button onClick={() => setSelectedPaymentMethod(null)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                            <ChevronRight className="w-4 h-4 rotate-180" /> Retour
                          </button>
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900">Instructions de Paiement</h3>
                        <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">
                          {selectedPaymentMethod === 'orange' ? 'Orange Money' : 
                           selectedPaymentMethod === 'moov' ? 'Moov Money' : 
                           selectedPaymentMethod === 'wave' ? 'Wave Money' : 
                           selectedPaymentMethod}
                        </p>
                      </div>
                          <button onClick={() => { setSelectedPlanForPayment(null); setSelectedPaymentMethod(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                          </button>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">1. Envoyez le montant exact</p>
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                                  <span className="text-2xl font-black text-slate-900">
                                    {selectedPlanForPayment === 'premium' ? (billingCycle === 'monthly' ? '15 000' : '135 000') : (billingCycle === 'monthly' ? '25 000' : '225 000')} FCFA
                                  </span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(selectedPlanForPayment === 'premium' ? (billingCycle === 'monthly' ? '15000' : '135000') : (billingCycle === 'monthly' ? '25000' : '225000'))}
                                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                  >
                                    <Copy className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                                  </button>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">2. Vers ce numéro de téléphone</p>
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                                  <span className="text-2xl font-black text-slate-900">
                                    {selectedPaymentMethod === 'orange' ? '+223 83 29 45 11' : '+223 66 49 19 67'}
                                  </span>
                                  <button 
                                    onClick={() => navigator.clipboard.writeText(selectedPaymentMethod === 'orange' ? '83294511' : '66491967')}
                                    className="p-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                  >
                                    <Copy className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-6">
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">3. Joignez une capture d'écran (Preuve)</p>
                                <label className="block p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer text-center group">
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file && selectedPlanForPayment !== 'free') handleManualPaymentSubmit(selectedPlanForPayment as 'premium' | 'pro', selectedPaymentMethod as 'orange' | 'moov' | 'wave', file);
                                    }}
                                  />
                                  {isUploadingProof ? (
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                                  ) : (
                                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                                  )}
                                  <p className="text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Uploader le reçu</p>
                                  <p className="text-[10px] text-slate-400 mt-1">Format JPG, PNG (Max 5MB)</p>
                                </label>
                              </div>
                              <button 
                                onClick={() => {
                                  if (selectedPlanForPayment !== 'free') {
                                    handleManualPaymentSubmit(selectedPlanForPayment as 'premium' | 'pro', selectedPaymentMethod as 'orange' | 'moov' | 'wave');
                                  }
                                }}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                              >
                                J'ai effectué le paiement
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                          <p className="text-xs text-blue-700 leading-relaxed font-medium">
                            Une fois le bouton cliqué, notre équipe vérifiera votre transaction sous 24h. Votre abonnement sera activé dès validation du reçu.
                          </p>
                        </div>
                      </div>
                    ) : null}
                  <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Sécurisé</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Vos données et transactions sont protégées par un cryptage de bout en bout.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Activation Instantanée</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Votre compte est mis à niveau dès que le paiement est confirmé.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">Assistance Locale</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Une équipe basée à Bamako pour vous accompagner au quotidien.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          } />

          {isGlobalAdmin && (
            <Route path="/admin_requests" element={
              <motion.div
                key="admin_requests"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Gestion des Paiements</h1>
                  <p className="text-slate-500">Validez manuellement les abonnements après réception Mobile Money.</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
                  Mode Développeur Actif
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {allSubscriptionRequests.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Inbox className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Aucune demande en attente</h3>
                    <p className="text-slate-500">Toutes les demandes ont été traitées.</p>
                  </div>
                ) : (
                  allSubscriptionRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              req.plan === 'pro' ? 'bg-slate-900 text-white' : 'bg-orange-100 text-orange-600'
                            }`}>
                              Plan {req.plan}
                            </span>
                            <span className="text-xs font-bold text-slate-400 capitalize">{req.method} Money</span>
                            <span className="text-xs text-slate-400">• Sollicité le {new Date(req.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{req.schoolName || 'École Sans Nom'}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-slate-500 font-medium truncate max-w-[200px]">{req.schoolEmail}</p>
                              {req.schoolPhone && req.schoolPhone !== "N/A" && (
                                <a 
                                  href={`tel:${req.schoolPhone}`}
                                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                                >
                                  <Phone className="w-3 h-3" />
                                  {req.schoolPhone}
                                </a>
                              )}
                            </div>
                            <p className="text-2xl font-black text-emerald-600 mt-3">{req.amount.toLocaleString()} FCFA</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => handleConfirmSubscription(req)}
                              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Confirmer le Paiement
                            </button>
                            <button 
                              onClick={async () => {
                                if (confirm('Rejeter cette demande ?')) {
                                  await updateDoc(doc(db, `schools/${req.schoolId}/subscription_requests`, req.id), {
                                    status: 'rejected'
                                  });
                                }
                              }}
                              className="px-6 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" /> Rejeter
                            </button>
                          </div>
                        </div>
                        
                        {req.proofUrl && (
                          <div className="w-full lg:w-72">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Justificatif</p>
                            <a href={req.proofUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
                              <img 
                                src={req.proofUrl} 
                                alt="Preuve de paiement" 
                                className="w-full h-40 object-cover rounded-2xl border border-slate-200 group-hover:opacity-75 transition-opacity"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/90 p-2 rounded-lg shadow-lg">
                                  <TrendingUp className="w-5 h-5 text-slate-900" />
                                </div>
                              </div>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          } />
          )}

          <Route path="/communication" element={
              <motion.div
                key="communication"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900">Communication SMS</h1>
                  <p className="text-slate-500">Envoyez des notifications et alertes aux parents d'élèves.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-8">
                    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit ${subscriptionPlan === 'free' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-orange-500" />
                        Envoyer un Message
                      </h2>
                      {subscriptionPlan === 'free' && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                          <p className="text-xs text-blue-700 font-medium">
                            L'envoi de SMS est réservé aux plans Premium et Pro.
                          </p>
                        </div>
                      )}
                      <form onSubmit={handleSendSMS} className="space-y-4">
                        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                          <button 
                            type="button"
                            onClick={() => setSmsTargetType('class')}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${smsTargetType === 'class' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            Par Classe
                          </button>
                          <button 
                            type="button"
                            onClick={() => setSmsTargetType('all')}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${smsTargetType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            Tous
                          </button>
                          <button 
                            type="button"
                            onClick={() => setSmsTargetType('manual')}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${smsTargetType === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            Manuel
                          </button>
                        </div>

                        {smsTargetType === 'class' && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-widest">Choisir la Classe</label>
                            <select 
                              value={selectedSmsClass}
                              onChange={(e) => setSelectedSmsClass(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            >
                              <option value="">Sélectionner une classe</option>
                              {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                              {/* Fallback for common Malian classes if empty */}
                              {classes.length === 0 && (
                                <>
                                  <option value="12ème (Terminale)">12ème (Terminale)</option>
                                  <option value="11ème">11ème</option>
                                  <option value="10ème">10ème</option>
                                  <option value="9ème">9ème</option>
                                  <option value="8ème">8ème</option>
                                  <option value="7ème">7ème</option>
                                </>
                              )}
                            </select>
                          </motion.div>
                        )}

                        {smsTargetType === 'manual' && (
                          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-widest">Destinataire</label>
                            <input 
                              type="text" 
                              value={newSmsRecipient}
                              onChange={(e) => setNewSmsRecipient(e.target.value)}
                              placeholder="Nom ou Numéro du parent"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                            />
                          </motion.div>
                        )}

                        {smsTargetType === 'all' && (
                          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest leading-normal">
                              Le message sera envoyé à tous les parents enregistrés dans l'établissement.
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-widest">Message</label>
                          <textarea 
                            rows={4}
                            value={newSmsContent}
                            onChange={(e) => setNewSmsContent(e.target.value)}
                            placeholder="Saisissez votre message ici..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
                        >
                          <Send className="w-4 h-4" />
                          {smsTargetType === 'all' ? 'Diffuser à tous' : smsTargetType === 'class' ? 'Envoyer à la classe' : 'Envoyer'}
                        </button>
                      </form>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                      <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
                        <Bell className="w-5 h-5 text-orange-500" />
                        Alertes Rapides
                      </h2>
                      <div className="space-y-3">
                        <button 
                          onClick={() => {
                            setSmsTargetType('class');
                            if (classes.length > 0) setSelectedSmsClass(classes[0].name);
                            else setSelectedSmsClass('10ème A');
                            setNewSmsContent(`Alerte Absence: Votre enfant a été marqué absent aujourd'hui. Merci de contacter l'administration de ${schoolInfo.name}.`);
                          }}
                          className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                          <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">Absence non justifiée</p>
                          <p className="text-[10px] text-slate-500">Alerte automatique aux parents pour absence.</p>
                        </button>
                        <button 
                          onClick={() => {
                            setSmsTargetType('class');
                            if (classes.length > 1) setSelectedSmsClass(classes[1].name);
                            else setSelectedSmsClass('9ème B');
                            setNewSmsContent(`Rappel de Paiement: Le règlement des frais de scolarité pour le mois en cours est attendu. Merci de votre compréhension. - ${schoolInfo.name}`);
                          }}
                          className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                          <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">Retard de paiement</p>
                          <p className="text-[10px] text-slate-500">Rappel amical pour les frais de scolarité.</p>
                        </button>
                        <button 
                          onClick={() => {
                            setSmsTargetType('all');
                            setNewSmsContent(`Réunion de Classe: Vous êtes invités à la réunion trimestrielle ce samedi à 10h00 dans l'enceinte de l'école. - La Direction`);
                          }}
                          className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                          <p className="text-xs font-bold text-slate-900 group-hover:text-orange-600">Réunion de classe</p>
                          <p className="text-[10px] text-slate-500">Invitation à la réunion trimestrielle.</p>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="font-bold text-lg">Historique des Envois</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {messages.map((msg) => (
                        <div key={msg.id} className="p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-slate-900">{msg.recipient}</span>
                            <span className="text-xs text-slate-500">{msg.date}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{msg.content}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {msg.status}
                          </span>
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <div className="p-12 text-center text-slate-400 italic">
                          Aucun message envoyé pour le moment.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              } />

              <Route path="/prospects" element={<ProspectsManagement schoolId={schoolId} students={students} subscriptionPlan={subscriptionPlan} />} />
              <Route path="/settings" element={
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900">Paramètres de l'Établissement</h1>
                  <p className="text-slate-500">Configurez les informations officielles de votre école.</p>
                </div>

                <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-200 overflow-hidden shadow-sm group cursor-pointer">
                        <img 
                          src={schoolInfo.logo || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=200&h=200&auto=format&fit=crop'} 
                          alt="Logo" 
                          className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + schoolInfo.name + '&background=f97316&color=fff';
                          }}
                        />
                        <input 
                          id="logo-upload"
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 500 * 1024) {
                                alert("L'image est trop lourde (max 500KB). Veuillez choisir une image plus petite.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setSchoolInfo({...schoolInfo, logo: reader.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <Plus className="w-6 h-6 text-slate-900" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Logo de l'école</h3>
                        <p className="text-sm text-slate-500">Format PNG ou JPG, max 2MB.</p>
                        <button 
                          type="button"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                          className="mt-2 text-xs font-bold text-orange-600 hover:underline"
                        >
                          Modifier le logo
                        </button>
                        
                        {/* Logo Suggestions */}
                        <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                          <p className="text-xs font-bold text-orange-800 mb-2 uppercase tracking-widest">Votre Page Vitrine Publique</p>
                          <div className="flex items-center gap-2">
                            <input 
                              readOnly
                              value={`${window.location.origin}/school/${schoolId}`}
                              className="flex-1 bg-white border border-orange-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-600"
                            />
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/school/${schoolId}`);
                                alert("Lien copié !");
                              }}
                              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                              title="Copier le lien"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <a 
                              href={`/school/${schoolId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white border border-slate-200 text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                              title="Voir la page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <p className="text-[10px] text-orange-600 mt-2 font-medium italic">Partagez ce lien avec les parents pour les pré-inscriptions en ligne.</p>
                        </div>
                        <div className="mt-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Suggestions Professionnelles</p>
                          <div className="flex gap-3">
                            {[
                              { id: 'academic', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=150&h=150&auto=format&fit=crop', label: 'Académique' },
                              { id: 'modern', url: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=150&h=150&auto=format&fit=crop', label: 'Moderne' }
                            ].map(opt => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setSchoolInfo({...schoolInfo, logo: opt.url})}
                                className={`group relative w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${schoolInfo.logo === opt.url ? 'border-orange-600 scale-110 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                                title={opt.label}
                              >
                                <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <Building2 className="w-3 h-3" /> Nom de l'Établissement
                        </label>
                        <input 
                          type="text" 
                          value={schoolInfo.name}
                          onChange={(e) => setSchoolInfo({...schoolInfo, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          Directeur / Responsable
                        </label>
                        <input 
                          type="text" 
                          value={schoolInfo.director}
                          onChange={(e) => setSchoolInfo({...schoolInfo, director: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          Couleur de marque
                        </label>
                        <div className="flex gap-2">
                          {['#f97316', '#3b82f6', '#10b981', '#6366f1', '#f43f5e'].map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setSchoolInfo({...schoolInfo, primaryColor: color})}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${schoolInfo.primaryColor === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <Phone className="w-3 h-3" /> Contact Officiel
                        </label>
                        <input 
                          type="text" 
                          value={schoolInfo.phone}
                          onChange={(e) => setSchoolInfo({...schoolInfo, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <Sparkles className="w-3 h-3" /> Devise / Slogan de l'école
                        </label>
                        <input 
                          type="text" 
                          value={schoolInfo.motto}
                          onChange={(e) => setSchoolInfo({...schoolInfo, motto: e.target.value})}
                          placeholder="Ex: L'excellence pour tous"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none font-medium italic"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <MapPin className="w-3 h-3" /> Adresse (Bamako, Mali)
                        </label>
                        <input 
                          type="text" 
                          value={schoolInfo.address}
                          onChange={(e) => setSchoolInfo({...schoolInfo, address: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                          <Mail className="w-3 h-3" /> Email de contact
                        </label>
                        <input 
                          type="email" 
                          value={schoolInfo.email}
                          onChange={(e) => setSchoolInfo({...schoolInfo, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                        />
                      </div>
                    </div>

                    {/* Tuition Fees Section */}
                    <div className="pt-8 mt-8 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-orange-500" /> Tarifs de Scolarité (Vitrine)
                          </h3>
                          <p className="text-xs text-slate-500">Ces tarifs seront affichés sur votre page vitrine publique.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newFees = [...(schoolInfo.tuitionFees || [])];
                            newFees.push({ id: Date.now().toString(), label: 'Nouveau Cycle', amount: 50000 });
                            setSchoolInfo({...schoolInfo, tuitionFees: newFees});
                          }}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 px-4 py-2 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                        >
                          <Plus className="w-3 h-3" /> Ajouter un tarif
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(schoolInfo.tuitionFees || []).map((fee: any, idx: number) => (
                          <div key={fee.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="sm:col-span-6 space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie / Cycle</label>
                              <input 
                                type="text"
                                value={fee.label}
                                onChange={(e) => {
                                  const newFees = [...schoolInfo.tuitionFees];
                                  newFees[idx].label = e.target.value;
                                  setSchoolInfo({...schoolInfo, tuitionFees: newFees});
                                }}
                                placeholder="ex: Primaire"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                              />
                            </div>
                            <div className="sm:col-span-4 space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix Annuel (FCFA)</label>
                              <input 
                                type="number"
                                value={fee.amount}
                                onChange={(e) => {
                                  const newFees = [...schoolInfo.tuitionFees];
                                  newFees[idx].amount = parseInt(e.target.value) || 0;
                                  setSchoolInfo({...schoolInfo, tuitionFees: newFees});
                                }}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                              />
                            </div>
                            <div className="sm:col-span-2 flex justify-end">
                              <button 
                                type="button"
                                onClick={() => {
                                  const newFees = schoolInfo.tuitionFees.filter((_: any, i: number) => i !== idx);
                                  setSchoolInfo({...schoolInfo, tuitionFees: newFees});
                                }}
                                className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {(schoolInfo.tuitionFees || []).length === 0 && (
                          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                             <p className="text-xs text-slate-400 italic">Aucun tarif personnalisé. Les tarifs par défaut seront affichés.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      {saveSettingsSuccess && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 text-emerald-600 font-bold text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Modifications enregistrées !
                        </motion.div>
                      )}
                      <div className="flex-1" />
                      <button 
                        type="button"
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className={`${schoolInfo.primaryColor === '#f97316' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'} text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg active:scale-95`}
                        style={{ backgroundColor: schoolInfo.primaryColor }}
                      >
                        {isSavingSettings ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isSavingSettings ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            } />

            <Route path="/" element={<Navigate to={userRole === 'teacher' ? "/schedule" : "/dashboard"} replace />} />
            <Route path="*" element={<Navigate to={userRole === 'teacher' ? "/schedule" : "/dashboard"} replace />} />
          </Routes>
        </AnimatePresence>
        )}

          {/* Payment Modal */}
          <AnimatePresence>
            {selectedPaymentMethod && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    if (!isPaymentProcessing) {
                      setSelectedPaymentMethod(null);
                      setPaymentStep('details');
                      setSmsCode('');
                      setUserPhoneNumber('');
                    }
                  }}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Finaliser le paiement</h3>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                          {selectedPaymentMethod === 'orange' ? 'Orange Money' : 
                           selectedPaymentMethod === 'moov' ? 'Moov Money' :
                           selectedPaymentMethod === 'wave' ? 'Wave' :
                           selectedPaymentMethod === 'mtn' ? 'MTN Mobile' :
                           selectedPaymentMethod === 'card' ? 'Carte Bancaire' : 'Paiement Manuel'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if (!isPaymentProcessing) {
                          setSelectedPaymentMethod(null);
                          setPaymentStep('details');
                          setSmsCode('');
                          setUserPhoneNumber('');
                        }
                      }}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <Plus className="w-5 h-5 rotate-45 text-slate-400" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8">
                    {paymentStep === 'success' ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 space-y-4"
                      >
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
                          <CheckSquare className="w-10 h-10" />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900">Paiement réussi !</h4>
                        <p className="text-slate-500 font-medium">
                          Votre abonnement est maintenant actif. Bienvenue dans l'expérience SchoolCore Pro.
                        </p>
                      </motion.div>
                    ) : paymentStep === 'sms' ? (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8" />
                          </div>
                          <h4 className="text-lg font-bold text-slate-900">Vérification du paiement</h4>
                          <p className="text-sm text-slate-500">
                            Un code de confirmation a été envoyé à votre téléphone.
                          </p>
                          <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-widest">
                            Code de démo: 123456
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Code de confirmation</label>
                          <input 
                            type="text" 
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value)}
                            placeholder="000000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-5 text-center text-3xl font-mono font-black tracking-[0.3em] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>

                        <button 
                          onClick={handleConfirmPayment}
                          disabled={isPaymentProcessing || !smsCode.trim()}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPaymentProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Validation en cours...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-5 h-5" />
                              Confirmer le paiement
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => setPaymentStep('details')}
                          disabled={isPaymentProcessing}
                          className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          Modifier le numéro
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        {(selectedPaymentMethod === 'orange' || selectedPaymentMethod === 'moov' || selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'wave') && (
                          <div className="space-y-6">
                            <div className="text-center space-y-2 mb-4">
                              <p className="text-sm text-slate-500">
                                Saisissez votre numéro de téléphone pour initier le paiement sécurisé.
                              </p>
                            </div>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Votre numéro de téléphone</label>
                                <div className="relative">
                                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                  <input 
                                    type="tel" 
                                    value={userPhoneNumber}
                                    onChange={(e) => setUserPhoneNumber(e.target.value)}
                                    placeholder="+223 XX XX XX XX"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-5 text-xl font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedPaymentMethod === 'card' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 uppercase">Numéro de carte</label>
                              <input 
                                type="text" 
                                placeholder="0000 0000 0000 0000"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Expiration</label>
                                <input 
                                  type="text" 
                                  placeholder="MM/YY"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">CVV</label>
                                <input 
                                  type="text" 
                                  placeholder="123"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedPaymentMethod === 'manual' && (
                          <div className="text-center py-4 space-y-4">
                            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                            <p className="text-sm text-slate-600 leading-relaxed">
                              Veuillez vous rendre à nos bureaux à Bamako ou contacter notre service commercial pour un paiement par chèque ou espèces.
                            </p>
                            <p className="font-bold text-slate-900">+223 66 49 19 67</p>
                          </div>
                        )}

                        <button 
                          onClick={handleConfirmPayment}
                          disabled={isPaymentProcessing || ((selectedPaymentMethod === 'orange' || selectedPaymentMethod === 'moov' || selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'wave') && !userPhoneNumber.trim())}
                          className="w-full mt-8 bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isPaymentProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Traitement en cours...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-5 h-5" />
                              {(selectedPaymentMethod === 'orange' || selectedPaymentMethod === 'moov' || selectedPaymentMethod === 'mtn' || selectedPaymentMethod === 'wave') ? 'Payer maintenant' : 'Confirmer le paiement'}
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Digital Vault Modal */}
          <AnimatePresence>
            {showVaultModal && selectedStudentForVault && (() => {
              const currentStudent = students.find(s => s.id === selectedStudentForVault.id) || selectedStudentForVault;
              return (
                <div className="fixed inset-0 z-[130] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                  >
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                          <FolderLock className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="font-black text-2xl text-slate-900 uppercase">Coffre-fort Numérique</h2>
                          <p className="text-sm text-slate-500 font-bold">Élève : {currentStudent.name} ({currentStudent.matricule})</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setShowVaultModal(false);
                          setSelectedStudentForVault(null);
                        }}
                        className="p-3 hover:bg-slate-200 rounded-2xl transition-all"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Summary & Upload */}
                        <div className="space-y-6">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Statistiques</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                                <p className="text-2xl font-black text-slate-900">{currentStudent.documents?.length || 0}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Fichiers</p>
                              </div>
                              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                                <p className="text-lg font-black text-slate-900 truncate">
                                  {currentStudent.documents?.reduce((acc, d) => acc + (parseFloat(d.size || '0')), 0).toFixed(1)} KB
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Utilisé</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Ajouter un Document</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-black text-indigo-600 uppercase mb-1 ml-1">Catégorie</label>
                                <select 
                                  value={newDocumentCategory}
                                  onChange={(e) => setNewDocumentCategory(e.target.value as any)}
                                  className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                >
                                  <option value="Extrait de naissance">Extrait de naissance</option>
                                  <option value="Photo d'identité">Photo d'identité</option>
                                  <option value="Certificat médical">Certificat médical</option>
                                  <option value="Diplôme">Diplôme (DEF, BAC...)</option>
                                  {userRole !== 'teacher' && <option value="Bulletin">Bulletin scolaire</option>}
                                  <option value="Autre">Autre</option>
                                </select>
                              </div>
                              
                              <div className="relative">
                                <input 
                                  type="file" 
                                  id="student-doc-upload"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        handleAddDocumentToStudent(
                                          currentStudent.id,
                                          file.name,
                                          reader.result as string,
                                          newDocumentCategory
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <button 
                                  onClick={() => document.getElementById('student-doc-upload')?.click()}
                                  disabled={isUploadingDocument}
                                  className="w-full bg-indigo-600 text-white rounded-xl py-3 text-xs font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
                                >
                                  {isUploadingDocument ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  {isUploadingDocument ? 'Transfert...' : 'Téléverser le fichier'}
                                </button>
                                <p className="text-[10px] text-center text-indigo-400 mt-2 italic">Format PDF, PNG ou JPG recommandé</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Document List */}
                        <div className="md:col-span-2 space-y-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-slate-900">Bibliothèque Numérique</h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                              <Filter className="w-3 h-3" /> Filtrer par type
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(currentStudent.documents || []).filter(d => userRole !== 'teacher' || d.category !== 'Bulletin').length > 0 ? (
                              currentStudent.documents!.filter(d => userRole !== 'teacher' || d.category !== 'Bulletin').map((doc) => (
                                <div key={doc.id} className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                                  <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                                      {doc.category === 'Bulletin' ? <FileText className="w-6 h-6" /> : <Archive className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-black text-slate-900 truncate uppercase mt-1">{doc.name}</p>
                                      <p className="text-[10px] font-bold text-indigo-500 uppercase">{doc.category}</p>
                                      <p className="text-[10px] text-slate-400 mt-1">{doc.dateAdded} • {doc.size}</p>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex gap-2">
                                    <a 
                                      href={doc.url} 
                                      download={doc.name}
                                      className="flex-1 bg-slate-50 text-slate-600 rounded-xl py-2 text-[10px] font-black text-center hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                      <Download className="w-3 h-3" /> Télécharger
                                    </a>
                                    <button 
                                      onClick={() => handleRemoveDocument(currentStudent.id, doc)}
                                      className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-2 py-16 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
                                <p className="text-sm font-bold text-slate-400">Aucun document archivé pour le moment</p>
                                <p className="text-xs text-slate-400 mt-1">Commencez par ajouter un document via le panneau de gauche</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={() => {
                          setShowVaultModal(false);
                          setSelectedStudentForVault(null);
                        }}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                      >
                        Fermer le coffre-fort
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })()}
          </AnimatePresence>

          {/* ID Card Modal */}
          <AnimatePresence>
            {showIdCardModal && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowIdCardModal(false)}
                  className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Générateur de Cartes Scolaires</h3>
                        <p className="text-sm text-slate-500">
                          {bulkIdCardStudents ? `Impression en masse (${bulkIdCardStudents.length} élèves)` : `Carte individuelle: ${selectedStudentForIdCard?.name}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => window.print()}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                      >
                        <Printer className="w-4 h-4" />
                        Imprimer {bulkIdCardStudents ? 'Tout' : 'la Carte'}
                      </button>
                      <button 
                        onClick={() => setShowIdCardModal(false)}
                        className="p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
                    <div className="flex flex-wrap justify-center gap-12 print:block print:p-0">
                      {bulkIdCardStudents ? (
                        bulkIdCardStudents.map(student => (
                          <StudentIDCard key={student.id} student={student} schoolInfo={schoolInfo} />
                        ))
                      ) : (
                        selectedStudentForIdCard && <StudentIDCard student={selectedStudentForIdCard} schoolInfo={schoolInfo} />
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white border-t border-slate-100 flex justify-center text-slate-400 text-xs font-medium">
                    <p className="flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-blue-400" />
                       Conseil: Pour une qualité optimale, utilisez du papier cartonné (200g+) et une imprimante couleur.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Bulletin Modal */}
          <AnimatePresence>
            {isBulletinModalOpen && selectedStudentForBulletin && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsBulletinModalOpen(false)}
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Générateur de Bulletin</h3>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                          {selectedStudentForBulletin.name} • {selectedStudentForBulletin.class}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsBulletinModalOpen(false)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <Plus className="w-5 h-5 rotate-45 text-slate-400" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {!generatedBulletin ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">1. Choisir le Trimestre</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['1er Trimestre', '2ème Trimestre', '3ème Trimestre'].map(term => (
                                <button
                                  key={term}
                                  onClick={() => setBulletinTerm(term)}
                                  className={`py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                    bulletinTerm === term ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                                  }`}
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-3">2. Choisir le Style</label>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { id: 'classic', label: 'Classique', desc: 'Format officiel Malien' },
                                { id: 'modern', label: 'Moderne', desc: 'Design épuré et coloré' },
                                { id: 'simple', label: 'Minimaliste', desc: 'Simple et efficace' },
                                { id: 'premium', label: 'Premium', desc: 'Analyses avancées' }
                              ].map(style => (
                                <button
                                  key={style.id}
                                  onClick={() => setSelectedBulletinStyle(style.id as any)}
                                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                    selectedBulletinStyle === style.id ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-200'
                                  }`}
                                >
                                  <p className={`font-bold text-sm ${selectedBulletinStyle === style.id ? 'text-orange-600' : 'text-slate-900'}`}>{style.label}</p>
                                  <p className="text-[10px] text-slate-500">{style.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={handleGenerateBulletin}
                            disabled={isGeneratingBulletin}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 disabled:opacity-50"
                          >
                            {isGeneratingBulletin ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyse des notes par l'IA...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5 text-orange-400" />
                                Générer le Bulletin
                              </>
                            )}
                          </button>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                            <FileText className="w-10 h-10 text-slate-200" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">Aperçu du Style</h4>
                            <p className="text-xs text-slate-500 mt-1">Sélectionnez un style pour voir un aperçu</p>
                          </div>
                          <div className="w-full aspect-[3/4] bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden relative">
                            {/* Style Previews */}
                            {selectedBulletinStyle === 'classic' && (
                              <div className="p-4 space-y-2 scale-75 origin-top">
                                <div className="h-4 w-3/4 bg-slate-100 rounded mx-auto mb-4" />
                                <div className="grid grid-cols-4 gap-1">
                                  {Array(8).fill(0).map((_, i) => <div key={i} className="h-2 bg-slate-50 border border-slate-100" />)}
                                </div>
                                <div className="h-20 w-full bg-slate-50 border border-slate-100" />
                              </div>
                            )}
                            {selectedBulletinStyle === 'modern' && (
                              <div className="p-4 space-y-3 scale-75 origin-top">
                                <div className="flex gap-2 items-center">
                                  <div className="w-6 h-6 rounded-full bg-orange-100" />
                                  <div className="h-3 w-1/2 bg-slate-100 rounded" />
                                </div>
                                <div className="space-y-2">
                                  {Array(4).fill(0).map((_, i) => <div key={i} className="h-6 w-full bg-slate-50 rounded-lg" />)}
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Bulletin Content */}
                        <div id="bulletin-to-print" className="bg-white p-8 border border-slate-200 shadow-sm rounded-xl max-w-3xl mx-auto overflow-x-auto">
                          {selectedBulletinStyle === 'classic' && <ClassicBulletin data={generatedBulletin} schoolInfo={schoolInfo} />}
                          {selectedBulletinStyle === 'modern' && <ModernBulletin data={generatedBulletin} schoolInfo={schoolInfo} />}
                          {selectedBulletinStyle === 'simple' && <SimpleBulletin data={generatedBulletin} schoolInfo={schoolInfo} />}
                          {selectedBulletinStyle === 'premium' && <PremiumBulletin data={generatedBulletin} schoolInfo={schoolInfo} />}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap justify-center gap-4">
                          <button 
                            onClick={() => window.print()}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                          >
                            <Printer className="w-4 h-4" />
                            Imprimer / PDF
                          </button>
                          <button 
                            onClick={() => {
                              const url = window.location.href;
                              navigator.clipboard.writeText(url);
                              alert("Lien du bulletin copié !");
                            }}
                            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            Copier le lien
                          </button>
                          <button 
                            onClick={() => setGeneratedBulletin(null)}
                            className="text-slate-500 font-bold px-6 py-3 hover:underline"
                          >
                            Modifier les options
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showScheduleModal && (
              <div className="fixed inset-0 z-[140] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-black text-xl text-slate-900 uppercase">
                          {editingScheduleEntry ? 'Modifier le cours' : 'Planifier un cours'}
                        </h2>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mt-1">
                          Gestion des horaires
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowScheduleModal(false)}
                      className="p-3 hover:bg-slate-200 rounded-2xl transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jour</label>
                        <select 
                          value={newScheduleDay}
                          onChange={(e) => setNewScheduleDay(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        >
                          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salle / Lieu</label>
                        <input 
                          type="text"
                          value={newScheduleRoom}
                          onChange={(e) => setNewScheduleRoom(e.target.value)}
                          placeholder="Ex: Salle 101, Labo..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classe</label>
                      <select 
                        value={newScheduleClassId}
                        onChange={(e) => setNewScheduleClassId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="">Sélectionner une classe</option>
                        {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matière</label>
                      <select 
                        value={newScheduleSubject}
                        onChange={(e) => setNewScheduleSubject(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="">Sélectionner une matière</option>
                        {newScheduleClassId && classes.find(c => c.name === newScheduleClassId)?.subjects?.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Enseignant</label>
                      <select 
                        value={newScheduleTeacherId}
                        onChange={(e) => setNewScheduleTeacherId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="">Sélectionner l'enseignant</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Début</label>
                        <input 
                          type="time"
                          value={newScheduleStartTime}
                          onChange={(e) => setNewScheduleStartTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fin</label>
                        <input 
                          type="time"
                          value={newScheduleEndTime}
                          onChange={(e) => setNewScheduleEndTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                    {editingScheduleEntry && (
                      <button 
                        onClick={() => {
                          handleDeleteScheduleEntry(editingScheduleEntry.id);
                          setShowScheduleModal(false);
                        }}
                        className="p-4 rounded-2xl bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
                        title="Supprimer définitivement"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setShowScheduleModal(false)}
                      className="flex-1 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={handleSaveScheduleEntry}
                      disabled={isSavingSchedule}
                      className="flex-2 px-10 py-4 rounded-2xl bg-orange-600 text-white font-black hover:bg-orange-700 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                    >
                      {isSavingSchedule && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editingScheduleEntry ? 'Mettre à jour' : 'Enregistrer le cours'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Student Progression Modal */}
          <AnimatePresence>
            {selectedStudentForProgression && (
              <ProgressionModal 
                student={selectedStudentForProgression} 
                students={students}
                bulletins={bulletins}
                onClose={() => setSelectedStudentForProgression(null)} 
                schoolId={schoolId}
              />
            )}
          </AnimatePresence>

          {/* Floating AI Assistant Button */}
          <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
            <AnimatePresence>
              {isAiChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 md:w-96 overflow-hidden flex flex-col h-[500px]"
                >
                  <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <span className="font-bold text-sm">Assistant SchoolCore</span>
                    </div>
                    <button onClick={() => setIsAiChatOpen(false)} className="hover:text-orange-400 transition-colors">
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
                    {aiChatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.role === 'user' 
                            ? 'bg-orange-500 text-white rounded-tr-none shadow-lg shadow-orange-500/10' 
                            : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                        }`}>
                          {msg.role === 'ai' ? (
                            <div className="prose prose-sm max-w-none">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          ) : msg.content}
                        </div>
                      </div>
                    ))}
                    {isAiChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  {aiChatMessages.length <= 1 && !isAiChatLoading && (
                    <div className="px-4 pb-3 flex flex-wrap gap-2">
                      {['💡 Comment générer un bulletin ?', '📊 Analyser les notes', '📉 Éleves faibles', '📅 Planning du jour'].map(q => (
                        <button
                          key={q}
                          onClick={() => {
                            setAiChatInput(q.replace(/^.*?\s/, ''));
                          }}
                          className="text-[9px] font-black uppercase tracking-widest bg-white border border-slate-100 px-3 py-1.5 rounded-full text-slate-500 hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleSendAiChatMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                      type="text"
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      placeholder="Posez votre question..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={isAiChatLoading || !aiChatInput.trim()}
                      className="bg-slate-900 text-white p-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsAiChatOpen(!isAiChatOpen)}
              className="w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative hover:bg-orange-600"
            >
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
              {isAiChatOpen ? <Plus className="w-6 h-6 rotate-45" /> : <MessageCircle className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


