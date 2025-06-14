<template>
  <Container>
    <div class="contacts">
      <h1>Contacts</h1>

      <!-- Import Section -->
      <div class="import-section">
        <input 
          type="file" 
          accept=".json" 
          @change="handleFileImport" 
          class="file-input"
          id="contacts-import"
        >
        <label for="contacts-import" class="import-button">
          Import Contacts (JSON)
        </label>
      </div>
      
      <div class="contacts-list">
        <div v-for="contact in allContacts" :key="contact.id" class="contact-item">
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
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '../stores/app'
import Container from '../components/Container.vue'
import type { Contact } from '../types/types'

const store = useAppStore()
const defaultContacts = ref<Contact[]>([])
const importedContacts = ref<Contact[]>([])

// Combine default and imported contacts
const allContacts = computed(() => [...defaultContacts.value, ...importedContacts.value])

// Handle file import
const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    console.log('No file selected')
    return
  }

  console.log('File selected:', file.name)
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const contacts = JSON.parse(content)
      
      // Validate contacts format
      if (!Array.isArray(contacts)) {
        throw new Error('Invalid contacts format: expected an array')
      }
      
      // Add custom prefix to IDs to avoid conflicts
      const processedContacts = contacts.map(contact => ({
        ...contact,
        id: `custom_${contact.id || Math.random().toString(36).substr(2, 9)}`
      }))
      
      console.log('Processed contacts:', processedContacts)
      importedContacts.value = processedContacts
      
      // Update store state
      if (!store.customData) {
        store.customData = {}
      }
      store.customData.contacts = processedContacts
      store.saveToLocalStorage()
      
      // Verify the save
      const verifyState = localStorage.getItem('vegas-app-state')
      console.log('Verified saved state:', verifyState)
    } catch (error) {
      console.error('Failed to parse contacts file:', error)
    }
  }
  reader.onerror = (error) => {
    console.error('Error reading file:', error)
  }
  reader.readAsText(file)
}

onMounted(async () => {
  try {
    // Load default contacts
    const response = await fetch('/data/contacts.json')
    defaultContacts.value = await response.json()
    
    // Load store state
    store.loadFromLocalStorage()
    
    // Initialize imported contacts from store
    if (store.customData?.contacts) {
      console.log('Loading contacts from store:', store.customData.contacts)
      importedContacts.value = store.customData.contacts
    }
  } catch (error) {
    console.error('Failed to load contacts:', error)
  }
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

.import-section {
  margin-bottom: 2rem;
}

.file-input {
  display: none;
}

.import-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.import-button:hover {
  background-color: var(--primary-color-dark);
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