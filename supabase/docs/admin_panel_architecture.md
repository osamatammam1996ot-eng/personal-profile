# Admin Panel Architecture & Development Guide

## Overview

The Admin Dashboard is a content management system for the portfolio website. It allows non-technical users to:
- Edit all website content in both English and Arabic
- Manage case studies and portfolio items
- Upload and manage images
- Control navigation and menu items
- Toggle sections on/off without deletion
- Reorder items via drag-and-drop
- Preview changes in real-time

**Key Design Principles:**
- **Bilingual-first**: Every field has EN/AR inputs side by side
- **WYSIWYG**: Real-time preview matching production UI
- **Permission-based**: Only Osama (via magic link) can edit
- **Audit trail**: All changes logged with timestamp and user
- **Non-destructive**: Soft delete (visibility toggle) by default

---

## Admin Panel File Structure

```
src/app/components/cms/
├── AdminDashboard.tsx           # Main admin container
├── AdminLayout.tsx              # Header, sidebar, auth status
├── AdminAuth.tsx                # Magic link login
├── ContentEditor.tsx            # Generic bilingual content editor
├── SectionTabs.tsx              # Tab navigation between sections
│
├── editors/
│   ├── HeroEditor.tsx           # Hero section specific UI
│   ├── WhyHireMeEditor.tsx      # Why hire me cards + editor
│   ├── SkillsEditor.tsx         # Skills disciplines + tags
│   ├── PortfolioEditor.tsx      # Case studies list + manager
│   ├── ToolsEditor.tsx          # Tools cards editor
│   ├── ContactEditor.tsx        # Contact info editor
│   ├── NavigationEditor.tsx     # Navigation menu items
│   └── SettingsEditor.tsx       # Global settings & SEO
│
├── components/
│   ├── Bilingual Input.tsx      # EN/AR side-by-side inputs
│   ├── CardListManager.tsx      # Drag-to-reorder cards
│   ├── ListItemManager.tsx      # Drag-to-reorder lists
│   ├── ImageUploader.tsx        # Image upload + metadata
│   ├── ImageBrowser.tsx         # Select existing images
│   ├── PreviewPane.tsx          # Live preview of changes
│   └── AuditLog.tsx             # Change history timeline
│
└── hooks/
    ├── useCmsAuth.ts            # Authentication state
    ├── useSectionData.ts        # Fetch section content
    ├── useSectionMutations.ts   # Save/delete mutations
    ├── useImageUpload.ts        # Upload to Supabase Storage
    └── useAuditLog.ts           # Fetch change history
```

---

## Component Architecture

### 1. AdminDashboard.tsx (Main Container)

**Purpose**: Entry point, coordinates all admin features
**Props**: None (uses React Router auth guard)
**State**: 
- `currentSection` - which section is being edited
- `isPreviewMode` - show/hide side-by-side preview
- `isSaving` - show loading state during save

**Key Features**:
- Auth guard (redirect to login if no session)
- Section tab navigation
- Save/reset buttons
- Draft/publish workflow
- Unsaved changes warning

```typescript
// Pseudo-code structure
export function AdminDashboard() {
  const { session, logout } = useCmsAuth();
  const [currentSection, setCurrentSection] = useState('hero');
  const [previewMode, setPreviewMode] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  return (
    <AdminLayout onLogout={logout}>
      <div className="admin-container">
        <SectionTabs 
          current={currentSection} 
          onChange={setCurrentSection}
        />
        
        <div className="editor-area">
          {previewMode && <PreviewPane section={currentSection} />}
          <SectionEditor section={currentSection} />
        </div>

        <div className="admin-actions">
          <button onClick={reset} disabled={!unsavedChanges}>Reset</button>
          <button onClick={save} variant="primary">Save Changes</button>
          <button onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? 'Hide' : 'Show'} Preview
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
```

---

### 2. AdminAuth.tsx (Magic Link Authentication)

**Purpose**: Login screen, handles magic link flow
**Flow**:
1. User enters email (hardcoded to osama@design email)
2. Click "Send Magic Link"
3. Supabase sends email with token
4. User clicks link → redirects back to /admin?token=xxx
5. Token validated, session created (JWT stored in localStorage)

```typescript
export function AdminAuth() {
  const [email, setEmail] = useState('');
  const [sentEmail, setSentEmail] = useState(false);
  const [error, setError] = useState('');

  const handleSendMagicLink = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/callback`
        }
      });
      if (error) throw error;
      setSentEmail(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Admin Login</h1>
      {!sentEmail ? (
        <>
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <button onClick={handleSendMagicLink}>Send Magic Link</button>
        </>
      ) : (
        <p>Check your email for the login link</p>
      )}
    </div>
  );
}
```

---

### 3. BilinguralInput.tsx (Core Editing Component)

**Purpose**: Reusable bilingual input field for all text content
**Props**:
- `label_en` string
- `label_ar` string
- `onChange` callback
- `type` 'text' | 'textarea' | 'rich'
- `maxLength?` number
- `charLimit?` boolean

**Layout**: 
```
┌─ English ─────────────────┬─ عربي ─────────────────┐
│ [Text input here]        │ [Text input here]      │
│ Character count: 145/200 │ Character count: 180/200 │
└────────────────────────────┴───────────────────────┘
```

```typescript
export function BilingualInput({
  label_en,
  label_ar,
  value_en,
  value_ar,
  onChange,
  type = 'text',
  maxLength = 500
}) {
  return (
    <div className="bilingual-input">
      <div className="column en">
        <label>English</label>
        <textarea 
          value={value_en}
          onChange={(e) => onChange('en', e.target.value)}
          maxLength={maxLength}
          placeholder={label_en}
        />
        <div className="char-count">
          {value_en.length} / {maxLength}
        </div>
      </div>

      <div className="column ar">
        <label>العربية</label>
        <textarea 
          value={value_ar}
          onChange={(e) => onChange('ar', e.target.value)}
          maxLength={maxLength}
          placeholder={label_ar}
          dir="rtl"
        />
        <div className="char-count">
          {value_ar.length} / {maxLength}
        </div>
      </div>
    </div>
  );
}
```

---

### 4. SectionEditor Components (Hero, WhyHireMe, etc.)

#### HeroEditor.tsx

**Content being edited:**
- Label (Osama Tammam · Cairo)
- Headline 1 & 2
- Description paragraph
- CTA buttons (See my work / Let's talk)
- Hero roles (list)
- Portrait image

```typescript
export function HeroEditor() {
  const { data, loading, error } = useSectionData('hero');
  const { updateContent, deleteListItem } = useSectionMutations('hero');

  return (
    <div className="hero-editor">
      <h2>Edit Hero Section</h2>

      <BilingualInput 
        label_en="Label"
        value_en={data.fields.hero_label_en}
        value_ar={data.fields.hero_label_ar}
        onChange={handleFieldChange}
        maxLength={50}
      />

      <BilingualInput 
        label_en="Headline 1"
        value_en={data.fields.hero_headline_1_en}
        value_ar={data.fields.hero_headline_1_ar}
        onChange={handleFieldChange}
      />

      {/* Repeat for Headline 2, Description, CTAs */}

      <div className="section">
        <h3>Hero Roles (List)</h3>
        <ListItemManager 
          items={data.lists.hero_roles}
          onItemChange={updateListItem}
          onItemDelete={deleteListItem}
          onReorder={reorderListItems}
        />
        <button onClick={() => addListItem('hero_roles')}>
          + Add Role
        </button>
      </div>

      <div className="section">
        <h3>Portrait Image</h3>
        <ImageUploader 
          currentImage={data.images.hero_portrait}
          onImageSelect={updateImage}
          aspectRatio="1:1"
        />
      </div>
    </div>
  );
}
```

#### WhyHireMeEditor.tsx

**Content being edited:**
- Section heading
- 4 cards, each with:
  - Title (EN/AR)
  - Description (EN/AR)
  - Display order

```typescript
export function WhyHireMeEditor() {
  const { data, loading } = useSectionData('why_hire_me');
  const { updateCard, deleteCard, reorderCards } = useSectionMutations('why_hire_me');

  return (
    <div className="whm-editor">
      <h2>Why Hire Me - Cards</h2>

      <CardListManager 
        cards={data.cards}
        onCardUpdate={updateCard}
        onCardDelete={deleteCard}
        onReorder={reorderCards}
        renderCardEditor={(card) => (
          <div key={card.id} className="card-edit-form">
            <BilingualInput 
              label_en="Card Title"
              value_en={card.title_en}
              value_ar={card.title_ar}
              onChange={(lang, val) => updateCard(card.id, { [`title_${lang}`]: val })}
            />
            <BilingualInput 
              label_en="Card Description"
              value_en={card.description_en}
              value_ar={card.description_ar}
              onChange={(lang, val) => updateCard(card.id, { [`description_${lang}`]: val })}
              type="textarea"
            />
            <button onClick={() => deleteCard(card.id)} variant="danger">
              Delete Card
            </button>
          </div>
        )}
      />

      <button onClick={() => createCard('whm_card_new')}>
        + Add Card
      </button>
    </div>
  );
}
```

#### SkillsEditor.tsx

**Content being edited:**
- Section heading & description
- 3 skill disciplines (cards), each with:
  - Title
  - Tagline
  - 3-4 tags (skill keywords)

```typescript
export function SkillsEditor() {
  const { data } = useSectionData('skills');
  
  return (
    <div className="skills-editor">
      <h2>Edit Skills Section</h2>

      <BilingualInput 
        label_en="Heading"
        value_en={data.fields.skills_heading_1_en}
        // ...
      />

      <div className="disciplines">
        {data.cards.map((discipline) => (
          <DisciplineCard 
            key={discipline.id}
            discipline={discipline}
            onUpdate={updateCard}
            onTagAdd={addTag}
            onTagDelete={deleteTag}
          />
        ))}
      </div>
    </div>
  );
}

// DisciplineCard component
function DisciplineCard({ discipline, onUpdate, onTagAdd, onTagDelete }) {
  return (
    <div className="discipline-card">
      <BilingualInput 
        label_en="Discipline Title"
        value_en={discipline.title_en}
        value_ar={discipline.title_ar}
        onChange={(lang, val) => onUpdate(discipline.id, { [`title_${lang}`]: val })}
      />

      <div className="tags-list">
        <label>Skills Tags</label>
        {discipline.tags.map((tag) => (
          <div key={tag.id} className="tag-item">
            <span dir="auto">{tag.text}</span>
            <button onClick={() => onTagDelete(tag.id)}>×</button>
          </div>
        ))}
      </div>

      <BilingualInput 
        label_en="Add New Tag"
        value_en={newTagEn}
        value_ar={newTagAr}
        onChange={setNewTag}
      />
      <button onClick={() => onTagAdd(discipline.id, newTagEn, newTagAr)}>
        Add Tag
      </button>
    </div>
  );
}
```

#### PortfolioEditor.tsx

**Content being edited:**
- Section heading & description
- 4 case studies, each with:
  - Title (EN/AR)
  - Description (EN/AR)
  - Display order

```typescript
export function PortfolioEditor() {
  const { data } = useSectionData('portfolio');
  const { updateCaseStudy, reorderCaseStudies } = useSectionMutations('portfolio');

  return (
    <div className="portfolio-editor">
      <h2>Edit Portfolio / Case Studies</h2>

      <div className="case-studies-list">
        {data.caseStudies.map((study) => (
          <div key={study.id} className="case-study-form">
            <BilingualInput 
              label_en="Project Name"
              value_en={study.title_en}
              value_ar={study.title_ar}
              onChange={(lang, val) => updateCaseStudy(study.id, { [`title_${lang}`]: val })}
            />
            
            <BilingualInput 
              label_en="Project Description"
              value_en={study.description_en}
              value_ar={study.description_ar}
              onChange={(lang, val) => updateCaseStudy(study.id, { [`description_${lang}`]: val })}
              type="textarea"
              maxLength={1000}
            />
          </div>
        ))}
      </div>

      <button onClick={() => createCaseStudy()}>
        + Add Case Study
      </button>
    </div>
  );
}
```

#### ToolsEditor.tsx

**Content being edited:**
- Section title & description
- 6 tool cards, each with:
  - Tool name (fixed/cannot edit)
  - Description (EN/AR)

```typescript
export function ToolsEditor() {
  const { data } = useSectionData('tools');
  const { updateToolCard } = useSectionMutations('tools');

  return (
    <div className="tools-editor">
      <h2>Edit Tools Section</h2>

      <BilingualInput 
        label_en="Section Title"
        value_en={data.fields.tools_title_en}
        // ...
      />

      <div className="tools-grid">
        {data.cards.map((tool) => (
          <div key={tool.id} className="tool-edit">
            <h4>{tool.title_en}</h4>
            {/* Tool name cannot be edited - it's fixed */}
            
            <BilingualInput 
              label_en="Tool Description"
              value_en={tool.description_en}
              value_ar={tool.description_ar}
              onChange={(lang, val) => updateToolCard(tool.id, { [`description_${lang}`]: val })}
              type="textarea"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 5. CardListManager.tsx (Reusable Drag-to-Reorder)

**Purpose**: Manage any list of cards with drag-and-drop reordering

```typescript
export function CardListManager({ 
  cards, 
  onCardUpdate, 
  onCardDelete, 
  onReorder,
  renderCardEditor 
}) {
  const [sortedCards, setSortedCards] = useState(cards);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    if (!destination) return;
    if (source.index === destination.index) return;

    const newOrder = Array.from(sortedCards);
    const [removed] = newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, removed);
    
    setSortedCards(newOrder);
    onReorder(newOrder.map((c, i) => ({ id: c.id, order: i })));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="cards">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sortedCards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'card-dragging' : ''}
                  >
                    {renderCardEditor(card)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
```

---

### 6. ImageUploader.tsx (Image Management)

**Purpose**: Upload images to Supabase Storage + store metadata in DB

**Features**:
- Drag-and-drop upload
- Crop/resize before upload
- Aspect ratio enforcement
- Alt text fields (EN/AR)
- Preview thumbnail

```typescript
export function ImageUploader({ 
  currentImage, 
  onImageSelect, 
  aspectRatio = '16:9' 
}) {
  const { uploadImage, loading } = useImageUpload();
  const [preview, setPreview] = useState(currentImage?.url);
  const [altText, setAltText] = useState({
    en: currentImage?.alt_en || '',
    ar: currentImage?.alt_ar || ''
  });

  const handleUpload = async (file) => {
    const { url, key } = await uploadImage(file, aspectRatio);
    
    onImageSelect({
      key,
      url,
      alt_text_en: altText.en,
      alt_text_ar: altText.ar,
      aspect_ratio: aspectRatio
    });
  };

  return (
    <div className="image-uploader">
      <div className="dropzone" onDrop={handleUpload}>
        {preview && <img src={preview} alt="preview" />}
        <p>Drop image here or click to upload</p>
      </div>

      <BilingualInput 
        label_en="Alt text"
        value_en={altText.en}
        value_ar={altText.ar}
        onChange={(lang, val) => setAltText({ ...altText, [lang]: val })}
        maxLength={150}
      />

      <button onClick={handleUpload} loading={loading}>
        Upload Image
      </button>
    </div>
  );
}
```

---

### 7. PreviewPane.tsx (Real-Time Preview)

**Purpose**: Shows what the website will look like with current changes

**Features**:
- Mirrors the production component
- Updates in real-time as admin edits
- Scrollable, responsive preview
- Dark/light mode toggle

```typescript
export function PreviewPane({ section }) {
  const { lang } = useLanguage();
  const { data } = useSectionData(section);

  // Import the actual component
  const Component = {
    hero: HeroComponent,
    why_hire_me: WhyHireMeComponent,
    skills: SkillsComponent,
    portfolio: PortfolioComponent,
    tools: ToolsComponent,
    contact: ContactComponent,
  }[section];

  return (
    <div className="preview-pane">
      <div className="preview-header">
        <h3>Live Preview</h3>
        <select value={lang} onChange={setLang}>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>

      <div className="preview-content">
        <Component data={data} isDark={false} />
      </div>
    </div>
  );
}
```

---

### 8. AuditLog.tsx (Change History)

**Purpose**: Shows who changed what and when

```typescript
export function AuditLog() {
  const { logs, loading } = useAuditLog();

  return (
    <div className="audit-log">
      <h3>Recent Changes</h3>
      
      <div className="log-entries">
        {logs.map((entry) => (
          <div key={entry.id} className="log-entry">
            <div className="timestamp">
              {new Date(entry.changed_at).toLocaleDateString()}
            </div>
            <div className="action">
              {entry.action} - {entry.table_name}
            </div>
            {entry.old_value && (
              <div className="diff">
                <strong>Before:</strong> {JSON.stringify(entry.old_value)}
              </div>
            )}
            {entry.new_value && (
              <div className="diff">
                <strong>After:</strong> {JSON.stringify(entry.new_value)}
              </div>
            )}
            <div className="user">{entry.changed_by}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Custom Hooks for Admin

### useSectionData.ts

```typescript
export function useSectionData(sectionKey: string, lang = 'en') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        // Fetch content
        const content = await supabase
          .from('content')
          .select('*')
          .eq('section_id', getSectionId(sectionKey));

        // Fetch cards
        const cards = await supabase
          .from('cards')
          .select('*, card_tags(*)')
          .eq('section_id', getSectionId(sectionKey))
          .order('display_order');

        // Fetch list items
        const items = await supabase
          .from('list_items')
          .select('*')
          .eq('section_id', getSectionId(sectionKey));

        // Fetch images
        const images = await supabase
          .from('images')
          .select('*')
          .eq('section_id', getSectionId(sectionKey));

        // Format data
        const formattedData = {
          fields: formatContentFields(content),
          cards: cards.data,
          lists: groupListItems(items.data),
          images: groupImages(images.data)
        };

        setData(formattedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [sectionKey, lang]);

  return { data, loading, error };
}
```

### useSectionMutations.ts

```typescript
export function useSectionMutations(sectionKey: string) {
  const [saving, setSaving] = useState(false);

  const updateContent = async (contentId: string, updates: object) => {
    setSaving(true);
    try {
      const result = await supabase
        .from('content')
        .update(updates)
        .eq('id', contentId)
        .select();
      
      return result.data[0];
    } finally {
      setSaving(false);
    }
  };

  const updateCard = async (cardId: string, updates: object) => {
    setSaving(true);
    try {
      const result = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId)
        .select();
      
      return result.data[0];
    } finally {
      setSaving(false);
    }
  };

  const deleteListItem = async (itemId: string) => {
    setSaving(true);
    try {
      await supabase.from('list_items').delete().eq('id', itemId);
      return { success: true };
    } finally {
      setSaving(false);
    }
  };

  const reorderItems = async (items: Array<{ id: string; display_order: number }>) => {
    setSaving(true);
    try {
      // Update all items' display_order in one batch
      const updates = items.map(item => ({
        id: item.id,
        display_order: item.display_order
      }));

      // Use Supabase batch update
      for (const update of updates) {
        await supabase
          .from('list_items')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      return { success: true };
    } finally {
      setSaving(false);
    }
  };

  return { 
    updateContent, 
    updateCard, 
    deleteListItem, 
    reorderItems,
    saving 
  };
}
```

### useCmsAuth.ts

```typescript
export function useCmsAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => listener?.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return { session, loading, logout };
}
```

---

## Styling & Layout

### Admin Dashboard Grid Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Admin Dashboard                                   [Logout]   │
├────────────┬──────────────────────────────────────────────────┤
│ Navigation │  ┌─ Section Tabs ─────────────────────────────┐  │
│  • Hero    │  │ [Hero] [Why Me] [Skills] [Tools] ...      │  │
│  • Why Me  │  └────────────────────────────────────────────┘  │
│  • Skills  │                                                  │
│  • Tools   │  ┌─ Editor Area ──────────────────────────────┐  │
│  • Contact │  │ ┌─ English ────────────┬─ عربي ──────────┐  │
│  • Settings│  │ │ [Bilingual Input]   │ [Bilingual]    │  │
│            │  │ │                      │                 │  │
│            │  │ └──────────────────────┴─────────────────┘  │
│            │  │                                              │
│            │  │ [Cards Manager / List Manager / etc]        │
│            │  │                                              │
│            │  └────────────────────────────────────────────┘  │
│            │                                                  │
│            │  ┌─ Preview ─────────────────────────────────┐  │
│            │  │  [Live website preview of this section]   │  │
│            │  │                                            │  │
│            │  └────────────────────────────────────────────┘  │
│            │                                                  │
│            │  [Reset]               [Save Changes] ✓         │
└────────────┴──────────────────────────────────────────────────┘
```

### Color Scheme (Build upon current app theme)

```css
/* Admin-specific overrides */
:root {
  --admin-bg: #f5f5f5;
  --admin-card: #ffffff;
  --admin-border: #e0e0e0;
  --admin-accent: #6366f1;  /* Indigo - matches site */
  --admin-danger: #ef4444;  /* Red for delete */
  --admin-success: #10b981; /* Green for save */
}

.admin-container {
  display: grid;
  grid-template-columns: 200px 1fr 400px;
  gap: 2rem;
  padding: 2rem;
  background: var(--admin-bg);
}

.bilingual-input {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: var(--admin-card);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--admin-border);
}
```

---

## Security & Permissions

### Authentication

- **Method**: Supabase Auth with magic links (email OTP)
- **Allowed Users**: Only osama@design email address (hardcoded in auth policy)
- **Session**: JWT token stored in localStorage, expires after 24 hours
- **Refresh**: Automatic refresh on page load

### Row Level Security (RLS) Policies

```sql
-- Only authenticated users can read content
CREATE POLICY "Allow authenticated users to read content"
  ON content
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admin can update/delete
CREATE POLICY "Only admin can modify content"
  ON content
  FOR UPDATE
  USING (auth.uid() = 'OSAMA_UID');

-- Audit trails are append-only
CREATE POLICY "Append-only audit log"
  ON audit_log
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Create `AdminDashboard.tsx` main container
- [ ] Create `AdminAuth.tsx` magic link login
- [ ] Set up `useCmsAuth.ts` hook
- [ ] Create admin route guard in App.tsx

### Phase 2: Core Editing
- [ ] Create `BilingualInput.tsx` component
- [ ] Create `SectionEditor.tsx` wrapper
- [ ] Create individual editors (Hero, WhyHireMe, Skills, etc.)
- [ ] Implement `useSectionData.ts` hook
- [ ] Implement `useSectionMutations.ts` hook

### Phase 3: Advanced Features
- [ ] Create `CardListManager.tsx` with drag-drop
- [ ] Create `ImageUploader.tsx` with Supabase Storage
- [ ] Create `PreviewPane.tsx` real-time preview
- [ ] Create `AuditLog.tsx` change history

### Phase 4: Polish
- [ ] Add loading/skeleton states
- [ ] Add error handling & user feedback
- [ ] Add keyboard shortcuts (Cmd+S save, Esc cancel)
- [ ] Add unsaved changes warning
- [ ] Mobile-responsive admin UI
- [ ] Dark mode support in admin

---

## Next Steps

1. **Deploy schema** to Supabase (run migrations)
2. **Seed initial data** (run 02_seed_content.sql)
3. **Build auth system** (AdminAuth component + magic links)
4. **Build BilingualInput** (reusable core component)
5. **Build individual section editors** (HeroEditor, WhyHireMeEditor, etc.)
6. **Connect to frontend** (useContext to fetch from Supabase instead of hardcoded)
7. **Test end-to-end** (edit in admin → changes appear on live site)

