import { Perfume, RecommendationResult, QuizPreferences, OlfactoryFamily } from '@/types/perfume';

// Family affinity graph (which families share similar aromatic DNA)
const FAMILY_AFFINITY: Record<OlfactoryFamily, OlfactoryFamily[]> = {
  'Oriental / Ámbar': ['Gourmand / Dulce', 'Cuero / Especiada', 'Amaderada'],
  'Amaderada': ['Cuero / Especiada', 'Aromática / Fougère', 'Oriental / Ámbar'],
  'Cítrica / Fresca': ['Aromática / Fougère', 'Floral'],
  'Floral': ['Cítrica / Fresca', 'Oriental / Ámbar', 'Gourmand / Dulce'],
  'Gourmand / Dulce': ['Oriental / Ámbar', 'Floral'],
  'Cuero / Especiada': ['Amaderada', 'Oriental / Ámbar', 'Aromática / Fougère'],
  'Aromática / Fougère': ['Amaderada', 'Cítrica / Fresca', 'Cuero / Especiada']
};

/**
 * Calculates similarity between a candidate perfume and one target perfume
 */
function calculateSingleSimilarity(candidate: Perfume, target: Perfume): {
  score: number;
  reasons: string[];
  matchingNotes: string[];
  matchingFamily: boolean;
  matchingVibe: boolean;
} {
  let score = 0;
  const reasons: string[] = [];

  // 1. Olfactory Family (Up to 35 pts)
  const isExactFamily = candidate.family === target.family;
  const isAffinityFamily = FAMILY_AFFINITY[target.family]?.includes(candidate.family);

  if (isExactFamily) {
    score += 35;
    reasons.push(`Misma familia olfativa (${candidate.family})`);
  } else if (isAffinityFamily) {
    score += 20;
    reasons.push(`Familia complementaria (${candidate.family})`);
  }

  // 2. Note Intersection (Up to 40 pts)
  const targetNotes = new Set(target.allNotes.map(n => n.toLowerCase()));
  const candidateNotes = new Set(candidate.allNotes.map(n => n.toLowerCase()));
  
  const sharedNotes: string[] = [];
  candidate.allNotes.forEach(note => {
    if (targetNotes.has(note.toLowerCase())) {
      sharedNotes.push(note);
    }
  });

  // Calculate note overlap percentage
  const maxPossibleNotes = Math.max(targetNotes.size, candidateNotes.size) || 1;
  const noteOverlapRatio = sharedNotes.length / maxPossibleNotes;
  const notePoints = Math.min(40, Math.round(noteOverlapRatio * 80) + (sharedNotes.length * 6));
  score += notePoints;

  if (sharedNotes.length > 0) {
    reasons.push(`Comparte ${sharedNotes.length} notas clave: ${sharedNotes.slice(0, 3).join(', ')}`);
  }

  // Check key note positions (Top vs Base)
  const sharedTop = candidate.topNotes.filter(n => 
    target.topNotes.some(tn => tn.toLowerCase() === n.toLowerCase())
  );
  if (sharedTop.length > 0) {
    score += 4;
  }

  const sharedBase = candidate.baseNotes.filter(n => 
    target.baseNotes.some(bn => bn.toLowerCase() === n.toLowerCase())
  );
  if (sharedBase.length > 0) {
    score += 6;
  }

  // 3. Gender & Target Audience Compatibility (Up to 15 pts)
  if (candidate.gender === target.gender || candidate.gender === 'Unisex' || target.gender === 'Unisex') {
    score += 15;
  } else {
    score += 5;
  }

  // 4. Sillage / Longevity & Concentration Style (Up to 10 pts)
  if (candidate.concentration === target.concentration) {
    score += 5;
  }
  
  // Vibe overlap
  const targetVibeWords = target.vibe.toLowerCase().split(/[,\s]+/);
  const candidateVibeWords = candidate.vibe.toLowerCase().split(/[,\s]+/);
  const sharedVibeWords = targetVibeWords.filter(w => w.length > 3 && candidateVibeWords.includes(w));
  
  const matchingVibe = sharedVibeWords.length > 0;
  if (matchingVibe) {
    score += 5;
    reasons.push(`Estilo aromático idéntico (${candidate.vibe.split(',')[0].trim()})`);
  }

  // Cap score between 55 and 99 for realistic feel
  const finalScore = Math.min(99, Math.max(50, Math.round(score)));

  return {
    score: finalScore,
    reasons,
    matchingNotes: sharedNotes,
    matchingFamily: isExactFamily,
    matchingVibe
  };
}

/**
 * Recommends perfumes based on 1 or 2 reference perfumes selected by the user
 */
export function getTwinPerfumeRecommendations(
  allPerfumes: Perfume[],
  selectedPerfumes: Perfume[],
  limit: number = 8
): RecommendationResult[] {
  if (!selectedPerfumes || selectedPerfumes.length === 0) {
    return [];
  }

  const selectedIds = new Set(selectedPerfumes.map(p => p.id));
  const candidates = allPerfumes.filter(p => !selectedIds.has(p.id));

  if (selectedPerfumes.length === 1) {
    const target = selectedPerfumes[0];
    const results = candidates.map(candidate => {
      const match = calculateSingleSimilarity(candidate, target);
      return {
        perfume: candidate,
        matchScore: match.score,
        reasons: match.reasons,
        matchingNotes: match.matchingNotes,
        matchingFamily: match.matchingFamily,
        matchingVibe: match.matchingVibe
      };
    });

    return results
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  // Mode: 2 Perfumes Selected (Dual Blend Matcher)
  const [p1, p2] = selectedPerfumes;

  const results = candidates.map(candidate => {
    const match1 = calculateSingleSimilarity(candidate, p1);
    const match2 = calculateSingleSimilarity(candidate, p2);

    // Calculate blended similarity
    const avgScore = (match1.score + match2.score) / 2;

    // Bonus if it shares notes with BOTH perfumes
    const notesInBoth = candidate.allNotes.filter(n => {
      const nl = n.toLowerCase();
      const inP1 = p1.allNotes.some(pn => pn.toLowerCase() === nl);
      const inP2 = p2.allNotes.some(pn => pn.toLowerCase() === nl);
      return inP1 && inP2;
    });

    let dualBonus = notesInBoth.length * 4;
    if (candidate.family === p1.family || candidate.family === p2.family) {
      dualBonus += 5;
    }

    const finalScore = Math.min(99, Math.max(55, Math.round(avgScore + dualBonus)));

    const combinedReasons: string[] = [];
    if (notesInBoth.length > 0) {
      combinedReasons.push(`Fusión perfecta: comparte notas con ambos perfumes (${notesInBoth.slice(0, 2).join(', ')})`);
    }
    if (candidate.family === p1.family && candidate.family === p2.family) {
      combinedReasons.push(`Comparte la familia ${candidate.family} de ambos perfumes`);
    } else if (candidate.family === p1.family) {
      combinedReasons.push(`Alineado a la familia de ${p1.name}`);
    } else if (candidate.family === p2.family) {
      combinedReasons.push(`Alineado a la familia de ${p2.name}`);
    }

    const allMatchingNotes = Array.from(new Set([...match1.matchingNotes, ...match2.matchingNotes]));
    if (combinedReasons.length < 2 && allMatchingNotes.length > 0) {
      combinedReasons.push(`Acordes compartidos: ${allMatchingNotes.slice(0, 3).join(', ')}`);
    }

    return {
      perfume: candidate,
      matchScore: finalScore,
      reasons: combinedReasons.length > 0 ? combinedReasons : [`Armonía olfativa balanceada con tus dos elecciones`],
      matchingNotes: allMatchingNotes,
      matchingFamily: candidate.family === p1.family || candidate.family === p2.family,
      matchingVibe: match1.matchingVibe || match2.matchingVibe
    };
  });

  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/**
 * Quiz Matcher: Finds top perfumes based on step-by-step sommelier quiz
 */
export function getQuizRecommendations(
  allPerfumes: Perfume[],
  quiz: QuizPreferences,
  limit: number = 6
): Perfume[] {
  return allPerfumes
    .filter(p => {
      // 1. Gender Filter
      if (quiz.gender && quiz.gender !== 'Todos') {
        if (p.gender !== quiz.gender && p.gender !== 'Unisex') return false;
      }
      
      // 2. Budget Filter
      if (quiz.budget) {
        if (quiz.budget === 'Económico (< $40.000)' && p.price >= 40000) return false;
        if (quiz.budget === 'Gama Media ($40.000 - $70.000)' && (p.price < 40000 || p.price > 70000)) return false;
        if (quiz.budget === 'Alta Gama (> $70.000)' && p.price <= 70000) return false;
      }

      // 3. Family Filter
      if (quiz.family && quiz.family !== 'Cualquiera') {
        if (p.family !== quiz.family) return false;
      }

      // 4. Occasion Filter
      if (quiz.occasion && quiz.occasion !== 'Cualquiera') {
        const matchesOccasion = p.occasions.some(occ => 
          occ.toLowerCase().includes(quiz.occasion!.toLowerCase()) ||
          p.vibe.toLowerCase().includes(quiz.occasion!.toLowerCase())
        );
        if (!matchesOccasion) return false;
      }

      return true;
    })
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, limit);
}
