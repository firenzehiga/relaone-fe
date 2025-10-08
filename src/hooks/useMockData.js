import { useState, useEffect } from "react";

// Import mock data
import usersData from "../mock/users.json";
import organizationsData from "../mock/organizations.json";
import categoriesData from "../mock/categories.json";
import eventsData from "../mock/events.json";
import participantsData from "../mock/participants.json";
import feedbacksData from "../mock/feedbacks.json";

// Hook untuk fetch mock data dengan loading simulation
export const useMockData = (dataType, delay = 500) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, delay));

        let result;
        switch (dataType) {
          case "users":
            result = usersData;
            break;
          case "organizations":
            result = organizationsData;
            break;
          case "categories":
            result = categoriesData;
            break;
          case "events":
            result = eventsData;
            break;
          case "participants":
            result = participantsData;
            break;
          case "feedbacks":
            result = feedbacksData;
            break;
          default:
            throw new Error(`Unknown data type: ${dataType}`);
        }

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType, delay]);

  return { data, loading, error };
};

// Hook untuk fetch specific event with related data
export const useEventDetail = (eventId) => {
  const [eventDetail, setEventDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Find event
      const event = eventsData.find((e) => e.id === parseInt(eventId));
      if (!event) {
        setLoading(false);
        return;
      }

      // Get organization info
      const organization = organizationsData.find(
        (org) => org.id === event.organization_id
      );

      // Get category info
      const category = categoriesData.find(
        (cat) => cat.id === event.category_id
      );

      // Get participants
      const participants = participantsData.filter(
        (p) => p.event_id === event.id
      );

      // Get participant details
      const participantDetails = participants.map((p) => {
        const user = usersData.find((u) => u.id === p.user_id);
        return { ...p, user };
      });

      // Get feedbacks
      const feedbacks = feedbacksData.filter((f) => f.event_id === event.id);

      // Get feedback details
      const feedbackDetails = feedbacks.map((f) => {
        const user = usersData.find((u) => u.id === f.user_id);
        return { ...f, user };
      });

      setEventDetail({
        ...event,
        organization,
        category,
        participants: participantDetails,
        feedbacks: feedbackDetails,
      });

      setLoading(false);
    };

    if (eventId) {
      fetchEventDetail();
    }
  }, [eventId]);

  return { eventDetail, loading };
};

// Hook untuk user registrations
export const useUserRegistrations = (userId) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const userParticipations = participantsData.filter(
        (p) => p.user_id === parseInt(userId)
      );

      const registrationsWithDetails = userParticipations.map((p) => {
        const event = eventsData.find((e) => e.id === p.event_id);
        const organization = organizationsData.find(
          (org) => org.id === event?.organization_id
        );
        const category = categoriesData.find(
          (cat) => cat.id === event?.category_id
        );

        return {
          ...p,
          event: { ...event, organization, category },
        };
      });

      setRegistrations(registrationsWithDetails);
      setLoading(false);
    };

    if (userId) {
      fetchRegistrations();
    }
  }, [userId]);

  return { registrations, loading };
};

// Hook untuk organization profile
export const useOrganizationProfile = (orgId) => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganization = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const org = organizationsData.find((o) => o.id === parseInt(orgId));
      if (!org) {
        setLoading(false);
        return;
      }

      // Get organization events
      const orgEvents = eventsData.filter((e) => e.organization_id === org.id);

      // Add category details to events
      const eventsWithCategories = orgEvents.map((event) => {
        const category = categoriesData.find(
          (cat) => cat.id === event.category_id
        );
        return { ...event, category };
      });

      setOrganization({
        ...org,
        events: eventsWithCategories,
      });

      setLoading(false);
    };

    if (orgId) {
      fetchOrganization();
    }
  }, [orgId]);

  return { organization, loading };
};
