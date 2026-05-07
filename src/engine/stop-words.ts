export const STOP_WORDS = new Set<string>([
  // 4-letter function words & high-frequency fillers
  'also', 'amid', 'away', 'back', 'been', 'both', 'came', 'come', 'does',
  'done', 'each', 'else', 'even', 'ever', 'from', 'give', 'goes', 'gone',
  'have', 'here', 'into', 'just', 'keep', 'kept', 'know', 'last', 'left',
  'less', 'like', 'long', 'look', 'made', 'make', 'many', 'more', 'most',
  'move', 'much', 'near', 'need', 'none', 'once', 'only', 'onto', 'over',
  'past', 'said', 'same', 'says', 'seen', 'self', 'send', 'sent', 'show',
  'side', 'some', 'soon', 'such', 'take', 'than', 'that', 'them', 'then',
  'they', 'this', 'thus', 'told', 'took', 'turn', 'upon', 'used', 'very',
  'want', 'went', 'were', 'what', 'when', 'whom', 'will', 'with', 'your',

  // 5-letter function words & high-frequency fillers
  'about', 'above', 'after', 'again', 'along', 'among', 'being', 'below',
  'comes', 'could', 'doing', 'every', 'given', 'going', 'hence', 'known',
  'later', 'least', 'means', 'might', 'never', 'often', 'other', 'ought',
  'prior', 'quite', 'shall', 'shown', 'since', 'still', 'taken', 'their',
  'there', 'these', 'those', 'truly', 'twice', 'under', 'until', 'using',
  'where', 'which', 'while', 'whose', 'would', 'years',

  // 6-letter function words & high-frequency fillers
  'almost', 'always', 'anyone', 'around', 'before', 'behind', 'called',
  'cannot', 'during', 'either', 'enough', 'except', 'former', 'giving',
  'having', 'itself', 'latter', 'little', 'making', 'mostly', 'myself',
  'nearly', 'nobody', 'rather', 'really', 'saying', 'should', 'simply',
  'taking', 'though', 'toward', 'unless', 'within',

  // 7-letter function words & high-frequency fillers
  'already', 'amongst', 'another', 'anybody', 'because', 'between',
  'certain', 'despite', 'further', 'however', 'neither', 'nothing',
  'outside', 'perhaps', 'several', 'someone', 'through', 'towards',
  'various', 'whether', 'without',
]);
