export const initialRequests = [
  {
    id: 1,
    bloodGroup: 'O+',
    patient: 'Emergency Case #242',
    urgency: 'Critical',
    responses: 7,
    status: 'Pending',
    requestedAt: '2026-10-07T08:15:00',
  },
  {
    id: 2,
    bloodGroup: 'A-',
    patient: 'Scheduled Surgery #118',
    urgency: 'High',
    responses: 4,
    status: 'Pending',
    requestedAt: '2026-10-07T07:05:00',
  },
  {
    id: 3,
    bloodGroup: 'AB+',
    patient: 'Maternity Care #331',
    urgency: 'Medium',
    responses: 2,
    status: 'Pending',
    requestedAt: '2026-10-07T06:40:00',
  },
  {
    id: 4,
    bloodGroup: 'B+',
    patient: 'Trauma Recovery #405',
    urgency: 'Low',
    responses: 1,
    status: 'Fulfilled',
    requestedAt: '2026-10-06T18:10:00',
  },
]

export const requestUrgency = ['Critical', 'High', 'Medium', 'Low']
