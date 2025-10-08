import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "../api/api";

// Query Keys
export const queryKeys = {
  events: ["events"],
  event: (id) => ["events", id],
  organizations: ["organizations"],
  organization: (id) => ["organizations", id],
  categories: ["categories"],
  userProfile: ["user", "profile"],
  userRegistrations: ["user", "registrations"],
};

// Events Queries
export const useEvents = (params = {}) => {
  return useQuery({
    queryKey: [...queryKeys.events, params],
    queryFn: () => endpoints.events.getAll(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEvent = (id) => {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: () => endpoints.events.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData) =>
      endpoints.events.create(eventData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
    },
  });
};

export const useJoinEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, userData }) =>
      endpoints.events.join(eventId, userData).then((res) => res.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.event(variables.eventId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.userRegistrations });
    },
  });
};

// Organizations Queries
export const useOrganizations = (params = {}) => {
  return useQuery({
    queryKey: [...queryKeys.organizations, params],
    queryFn: () =>
      endpoints.organizations.getAll(params).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOrganization = (id) => {
  return useQuery({
    queryKey: queryKeys.organization(id),
    queryFn: () => endpoints.organizations.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

// Categories Queries
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => endpoints.categories.getAll().then((res) => res.data),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
};

// User Queries
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: () => endpoints.users.getProfile().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserRegistrations = () => {
  return useQuery({
    queryKey: queryKeys.userRegistrations,
    queryFn: () => endpoints.users.getRegistrations().then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData) =>
      endpoints.users.updateProfile(profileData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
};

// Auth Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) =>
      endpoints.auth.login(credentials).then((res) => res.data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData) =>
      endpoints.auth.register(userData).then((res) => res.data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => endpoints.auth.logout(),
    onSuccess: () => {
      localStorage.removeItem("authToken");
      queryClient.clear(); // Clear all cached data
    },
  });
};
