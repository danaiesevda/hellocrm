import data from "@/data/contacts.json"

export function getData() {
  return data
}

export function getDeals() {
  return data.deals || []
}

export function getContacts() {
  return data.contacts || []
}

export function getCompanies() {
  return data.companies || []
}

export function getTickets() {
  return data.tickets || []
}

export function getActivities() {
  return data.activities || []
}

export function getUsers() {
  return data.users || []
}

