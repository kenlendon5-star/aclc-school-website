# TODO: Fix "All Classes" Option in Announcement and Event Forms

## Tasks
- [x] Update `announcementSchema` in `src/lib/formValidationSchemas.ts` to make `classId` optional, preprocessing empty strings to undefined
- [x] Update `eventSchema` in `src/lib/formValidationSchemas.ts` to make `classId` optional, preprocessing empty strings to undefined
- [ ] Test the forms to ensure selecting "All classes" no longer shows the "Class is required!" error
