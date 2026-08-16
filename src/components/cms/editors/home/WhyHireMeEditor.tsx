import type { CmsData } from '../../../../types/cms';
import { BilingualField, cardClasses } from '../../../../components/cms/shared/BilingualField';

interface WhyHireMeEditorProps {
  draft: CmsData;
  updateDraft: (updater: (prev: CmsData) => CmsData) => void;
  updateWhyCard: (index: number, updater: (card: CmsData['whyHireMe']['cards'][number]) => CmsData['whyHireMe']['cards'][number]) => void;
}

export function WhyHireMeEditor({ draft, updateDraft, updateWhyCard }: WhyHireMeEditorProps) {
  return (
    <div className="grid gap-3">
      <h2 className="text-white mt-0">Why Hire Me</h2>
      <BilingualField
        label="Word 1"
        en={draft.whyHireMe.word1.en}
        ar={draft.whyHireMe.word1.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word1: { ...prev.whyHireMe.word1, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word1: { ...prev.whyHireMe.word1, ar: value } } }))}
      />
      <BilingualField
        label="Word 2"
        en={draft.whyHireMe.word2.en}
        ar={draft.whyHireMe.word2.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word2: { ...prev.whyHireMe.word2, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word2: { ...prev.whyHireMe.word2, ar: value } } }))}
      />
      <BilingualField
        label="Word 3"
        en={draft.whyHireMe.word3.en}
        ar={draft.whyHireMe.word3.ar}
        onChangeEn={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word3: { ...prev.whyHireMe.word3, en: value } } }))}
        onChangeAr={(value) => updateDraft((prev) => ({ ...prev, whyHireMe: { ...prev.whyHireMe, word3: { ...prev.whyHireMe.word3, ar: value } } }))}
      />

      {[0, 1, 2, 3].map((index) => {
        const card = draft.whyHireMe.cards[index] ?? {
          title: { en: '', ar: '' },
          desc: { en: '', ar: '' },
        };
        return (
          <div key={index} className={cardClasses}>
            <p className="m-0 mb-2.5 text-white font-bold text-[13px]">
              Card {index + 1}
            </p>
            <div className="grid gap-2.5">
              <BilingualField
                label="Title"
                en={card.title.en}
                ar={card.title.ar}
                onChangeEn={(value) => updateWhyCard(index, (current) => ({ ...current, title: { ...current.title, en: value } }))}
                onChangeAr={(value) => updateWhyCard(index, (current) => ({ ...current, title: { ...current.title, ar: value } }))}
              />
              <BilingualField
                label="Description"
                multiline
                en={card.desc.en}
                ar={card.desc.ar}
                onChangeEn={(value) => updateWhyCard(index, (current) => ({ ...current, desc: { ...current.desc, en: value } }))}
                onChangeAr={(value) => updateWhyCard(index, (current) => ({ ...current, desc: { ...current.desc, ar: value } }))}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
