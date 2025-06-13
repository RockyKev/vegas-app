<template>
  <Container>
    <div class="contacts">
      <h1>Contacts</h1>
      
      <div class="contacts-list">
        <div v-for="contact in contacts" :key="contact.id" class="contact-item">
          <span class="contact-name">{{ contact.name }}</span>
          <span class="contact-title">{{ contact.title }}</span>
          <a 
            v-if="contact.email" 
            :href="`mailto:${contact.email}`"
            class="contact-link"
          >
            📧
          </a>
          <a 
            v-if="contact.phone" 
            :href="`tel:${contact.phone}`"
            class="contact-link"
          >
            📱
          </a>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Container from '../components/Container.vue'

interface Contact {
  id: string
  name: string
  title?: string
  email?: string
  phone?: string
}

const contacts = ref<Contact[]>([])

// Mock data for now - will be replaced with data/contacts.json
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    title: 'Senior Developer',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'Product Manager',
    email: 'sarah@innovate.com',
    phone: '+1 (555) 987-6543'
  }
]

onMounted(() => {
  contacts.value = mockContacts
})
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

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.contact-name {
  font-weight: 500;
  color: var(--text-color);
  min-width: 150px;
}

.contact-title {
  color: #666;
  flex: 1;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: opacity 0.2s;
}

.contact-link:hover {
  opacity: 0.8;
}

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}
</style> 