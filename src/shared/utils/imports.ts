// React
import React from "react";
import {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "react";

// React Router
import {
	useNavigate,
	useSearchParams,
	useParams,
	Link,
	NavLink,
	useLocation,
} from "react-router-dom";

// React Query
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
} from "@tanstack/react-query";

// i18n
import { useTranslation } from "react-i18next";

// Application contexts
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

// UI components
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Integrations
import { supabase } from "@/integrations/supabase/client";

// Types
import type {
	User,
	CartItem,
	ApiError,
	SortDirection,
} from "@/shared/types";

// Re-export all above imports
export {
	// React
	React,
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,

	// React Router
	useNavigate,
	useSearchParams,
	useParams,
	Link,
	NavLink,
	useLocation,

	// React Query
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,

	// i18n
	useTranslation,

	// Application contexts
	useAuth,
	useCart,
	useLanguage,

	// UI components
	Button,
	toast,
	Input,
	Card,
	Slider,
	Label,
	Checkbox,

	// Integrations
	supabase,
};

// Re-export types
export type { User, CartItem, ApiError, SortDirection };

// Re-export product types
export type * from "@/features/products/types";
