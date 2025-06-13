<template>
  <Container>
    <div class="contacts">
      <h1>Contacts</h1>
      
      <div class="contacts-header">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search contacts..."
            class="search-input"
          />
        </div>
        <button class="add-contact-button" @click="showAddContact = true">
          Add Contact
        </button>
      </div>

      <div class="contacts-list">
        <div v-for="contact in filteredContacts" :key="contact.id" class="contact-card card">
          <div class="contact-header">
            <h2>{{ contact.name }}</h2>
            <div class="contact-actions">
              <button 
                class="action-button"
                @click="toggleContactStatus(contact.id)"
                :aria-label="getStatusLabel(contact.id)"
              >
                {{ getStatusIcon(contact.id) }}
              </button>
            </div>
          </div>
          
          <div class="contact-details">
            <p v-if="contact.title" class="contact-title">{{ contact.title }}</p>
            <p v-if="contact.company" class="contact-company">{{ contact.company }}</p>
            
            <div class="contact-links">
              <a 
                v-if="contact.email" 
                :href="`mailto:${contact.email}`"
                class="contact-link"
              >
                📧 {{ contact.email }}
              </a>
              <a 
                v-if="contact.phone" 
                :href="`tel:${contact.phone}`"
                class="contact-link"
              >
                📱 {{ contact.phone }}
              </a>
            </div>

            <p v-if="contact.notes" class="contact-notes">{{ contact.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Add Contact Modal -->
      <div v-if="showAddContact" class="modal">
        <div class="modal-content card">
          <h2>Add New Contact</h2>
          <form @submit.prevent="addContact" class="contact-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="newContact.name"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="title">Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="newContact.title"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="company">Company</label>
              <input 
                type="text" 
                id="company" 
                v-model="newContact.company"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="newContact.email"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="phone">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="newContact.phone"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="notes">Notes</label>
              <textarea 
                id="notes" 
                v-model="newContact.notes"
                class="form-input"
                rows="3"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="showAddContact = false" class="cancel-button">
                Cancel
              </button>
              <button type="submit" class="submit-button">
                Add Contact
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'
import Container from '../components/Container.vue'

interface Contact {
  id: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  notes?: string
}

const store = useAppStore()
const searchQuery = ref('')
const showAddContact = ref(false)

const newContact = ref<Partial<Contact>>({
  name: '',
  title: '',
  company: '',
  email: '',
  phone: '',
  notes: ''
})

// Mock data for now - will be replaced with actual data management
const contacts = ref<Contact[]>([
  {
    id: '1',
    name: 'John Smith',
    title: 'Senior Developer',
    company: 'Tech Corp',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    notes: 'Met at the morning keynote. Interested in our API integration.'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Product Manager',
    company: 'Innovate Inc',
    email: 'sarah@innovate.com',
    phone: '+1 (555) 987-6543',
    notes: 'Discussed potential partnership opportunities.'
  }
])

const filteredContacts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(query) ||
    contact.company?.toLowerCase().includes(query) ||
    contact.title?.toLowerCase().includes(query)
  )
})

const getStatusIcon = (contactId: string) => {
  const status = store.peopleStatus[contactId]
  switch (status) {
    case 'connected':
      return '✓'
    case 'followed-up':
      return '★'
    default:
      return '○'
  }
}

const getStatusLabel = (contactId: string) => {
  const status = store.peopleStatus[contactId]
  switch (status) {
    case 'connected':
      return 'Mark as not connected'
    case 'followed-up':
      return 'Mark as not followed up'
    default:
      return 'Mark as connected'
  }
}

const toggleContactStatus = (contactId: string) => {
  const currentStatus = store.peopleStatus[contactId]
  let newStatus: 'not-met' | 'connected' | 'followed-up'
  
  switch (currentStatus) {
    case 'connected':
      newStatus = 'followed-up'
      break
    case 'followed-up':
      newStatus = 'not-met'
      break
    default:
      newStatus = 'connected'
  }
  
  store.updatePersonStatus(contactId, newStatus)
}

const addContact = () => {
  const contact: Contact = {
    id: Date.now().toString(),
    name: newContact.value.name || '',
    title: newContact.value.title,
    company: newContact.value.company,
    email: newContact.value.email,
    phone: newContact.value.phone,
    notes: newContact.value.notes
  }
  
  contacts.value.push(contact)
  showAddContact.value = false
  newContact.value = {
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    notes: ''
  }
}
</script>

<style scoped>
.contacts {
  padding: 1rem 0;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: var(--text-color);
}

.contacts-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.add-contact-button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.add-contact-button:hover {
  opacity: 0.9;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

.contact-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  font-size: 1.25rem;
  color: #666;
  transition: color 0.2s;
}

.action-button:hover {
  color: var(--primary-color);
}

.contact-details {
  color: var(--text-color);
}

.contact-title,
.contact-company {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
}

.contact-link:hover {
  text-decoration: underline;
}

.contact-notes {
  margin: 1rem 0 0;
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
}

textarea.form-input {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button {
  background: none;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-color);
  transition: all 0.2s;
}

.cancel-button:hover {
  background: #f8f9fa;
}

.submit-button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.submit-button:hover {
  opacity: 0.9;
}

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .contacts-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}
</style> 