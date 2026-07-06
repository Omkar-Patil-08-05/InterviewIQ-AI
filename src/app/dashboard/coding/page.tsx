import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AnalyticsData, ExtendedCodingAttempt, DailyActivity, LanguageStat } from "@/types/analytics"
import CodingAnalyticsClient from "./CodingAnalyticsClient"
import { EmptyState } from "@/components/ui/empty-state"
import { Code2 } from "lucide-react"

export default async function CodingDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const rawAttempts = await prisma.codingAttempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { 
      question: {
        include: {
          interview: true
        }
      } 
    }
  })

  // We cast this safely because we know the include guarantees it.
  const attempts = rawAttempts as unknown as ExtendedCodingAttempt[];

  if (attempts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Coding Analytics</h1>
        <EmptyState
          icon={<Code2 className="w-12 h-12" />}
          title="No coding history yet"
          description="Complete your first technical mock interview to generate deep analytics on your code execution, time complexity, and language proficiency."
          actionLabel="Start Interview Setup"
          actionHref="/dashboard/setup"
        />
      </div>
    )
  }

  const totalExecutions = attempts.length;
  
  // Unique problems attempted
  const uniqueQuestionIds = new Set(attempts.map(a => a.questionId));
  const totalProblemsAttempted = uniqueQuestionIds.size;

  // Problems solved (at least one passed execution)
  const solvedQuestionIds = new Set(
    attempts.filter(a => a.executionStatus === 'Passed').map(a => a.questionId)
  );
  const totalProblemsSolved = solvedQuestionIds.size;

  const passedAttempts = attempts.filter(a => a.executionStatus === 'Passed');
  const successRate = totalExecutions > 0 ? Math.round((passedAttempts.length / totalExecutions) * 100) : 0;

  const validRuntimes = passedAttempts.map(a => a.runtimeMs).filter(r => r > 0);
  const avgRuntime = validRuntimes.length > 0 
    ? Math.round(validRuntimes.reduce((a, b) => a + b, 0) / validRuntimes.length) 
    : 0;

  const validMemories = passedAttempts.map(a => a.memoryMb).filter(m => m > 0);
  const avgMemory = validMemories.length > 0 
    ? +(validMemories.reduce((a, b) => a + b, 0) / validMemories.length).toFixed(2) 
    : 0;

  const validScores = attempts.map(a => (a.aiReview as any)?.codeQualityScore).filter(s => typeof s === 'number');
  const avgAiScore = validScores.length > 0 
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
    : 0;

  // Most common time & space complexity for passed attempts
  const passedComplexities = passedAttempts.map(a => a.timeComplexity).filter(Boolean);
  const commonTimeComplexity = passedComplexities.length > 0
    ? passedComplexities.sort((a,b) => passedComplexities.filter(v => v===a).length - passedComplexities.filter(v => v===b).length).pop() || "O(N)"
    : "N/A";

  const passedSpace = passedAttempts.map(a => a.spaceComplexity).filter(Boolean);
  const commonSpaceComplexity = passedSpace.length > 0
    ? passedSpace.sort((a,b) => passedSpace.filter(v => v===a).length - passedSpace.filter(v => v===b).length).pop() || "O(1)"
    : "N/A";

  // Streak Calculation
  const dates = attempts.map(a => new Date(a.createdAt).toISOString().split('T')[0]).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const uniqueDates = Array.from(new Set(dates));
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const todayObj = new Date();
  const today = todayObj.toISOString().split('T')[0];
  const yesterdayObj = new Date(todayObj);
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterday = yesterdayObj.toISOString().split('T')[0];

  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    const checkDate = new Date(uniqueDates.includes(today) ? today : yesterday);
    for (const d of uniqueDates) {
      if (d === checkDate.toISOString().split('T')[0]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  if (uniqueDates.length > 0) {
    tempStreak = 1;
    longestStreak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const d1 = new Date(uniqueDates[i]);
      const d2 = new Date(uniqueDates[i+1]);
      const diff = (d1.getTime() - d2.getTime()) / 86400000;
      if (diff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
  }

  // Daily Activity Heatmap
  const activityMap: Record<string, number> = {};
  uniqueDates.forEach(d => {
    activityMap[d] = attempts.filter(a => new Date(a.createdAt).toISOString().split('T')[0] === d).length;
  });
  const dailyActivity: DailyActivity[] = Object.entries(activityMap).map(([date, count]) => ({ date, count }));

  // Language Stats
  const langMap: Record<string, LanguageStat> = {};
  attempts.forEach(a => {
    if (!langMap[a.language]) {
      langMap[a.language] = { language: a.language, count: 0, successRate: 0, avgRuntime: 0, avgMemory: 0, avgScore: 0 };
    }
    langMap[a.language].count++;
  });
  
  let favoriteLanguage = "None";
  let maxCount = 0;

  for (const lang of Object.keys(langMap)) {
    if (langMap[lang].count > maxCount) {
      maxCount = langMap[lang].count;
      favoriteLanguage = lang;
    }
    
    const langAttempts = attempts.filter(a => a.language === lang);
    const langPassed = langAttempts.filter(a => a.executionStatus === 'Passed');
    
    langMap[lang].successRate = Math.round((langPassed.length / langAttempts.length) * 100) || 0;
    
    const lRuntimes = langPassed.map(a => a.runtimeMs).filter(r => r > 0);
    langMap[lang].avgRuntime = lRuntimes.length > 0 ? Math.round(lRuntimes.reduce((a,b)=>a+b,0)/lRuntimes.length) : 0;
    
    const lMem = langPassed.map(a => a.memoryMb).filter(m => m > 0);
    langMap[lang].avgMemory = lMem.length > 0 ? +(lMem.reduce((a,b)=>a+b,0)/lMem.length).toFixed(2) : 0;

    const lScores = langAttempts.map(a => (a.aiReview as any)?.codeQualityScore).filter(s => typeof s === 'number');
    langMap[lang].avgScore = lScores.length > 0 ? Math.round(lScores.reduce((a,b)=>a+b,0)/lScores.length) : 0;
  }

  const languageStats = Object.values(langMap).sort((a,b) => b.count - a.count);

  // Compute Achievements
  const unlockedIds: string[] = [];
  if (totalExecutions > 0) unlockedIds.push("first_sub");
  if (totalProblemsSolved > 0) unlockedIds.push("first_acc");
  if (totalProblemsSolved >= 10) unlockedIds.push("prob_10");
  if (totalProblemsSolved >= 50) unlockedIds.push("prob_50");
  if (totalProblemsSolved >= 100) unlockedIds.push("prob_100");
  if (totalProblemsSolved >= 5 && avgRuntime > 0 && avgRuntime < 50) unlockedIds.push("runtime_master");
  if (totalProblemsSolved >= 5 && avgMemory > 0 && avgMemory < 10) unlockedIds.push("memory_optimizer");
  if (longestStreak >= 7) unlockedIds.push("consistent");
  if (longestStreak >= 30) unlockedIds.push("consistent_30");
  if (totalProblemsSolved >= 5 && avgAiScore >= 90) unlockedIds.push("ai_expert");
  if (langMap["python"] && langMap["python"].count >= 10 && langMap["python"].successRate >= 80) unlockedIds.push("python_expert");
  if (langMap["javascript"] && langMap["javascript"].count >= 10 && langMap["javascript"].successRate >= 80) unlockedIds.push("js_expert");
  if (langMap["cpp"] && langMap["cpp"].count >= 10 && langMap["cpp"].successRate >= 80) unlockedIds.push("cpp_expert");

  // Save to Prisma
  if (unlockedIds.length > 0) {
    try {
      // Find existing
      const existing = await prisma.achievement.findMany({
        where: { userId: user.id }
      });
      const existingNames = new Set(existing.map(a => a.badgeName));
      
      const newAchievements = unlockedIds.filter(id => !existingNames.has(id));
      if (newAchievements.length > 0) {
        await prisma.achievement.createMany({
          data: newAchievements.map(id => ({
            userId: user.id,
            badgeName: id
          })),
          skipDuplicates: true,
        });
      }
    } catch (e) {
      console.error("Failed to save achievements", e);
    }
  }

  const analyticsData: AnalyticsData = {
    attempts,
    totalProblemsAttempted,
    totalProblemsSolved,
    successRate,
    avgRuntime,
    avgMemory,
    avgAiScore,
    currentStreak,
    longestStreak,
    totalCodingTime: totalExecutions * 5, // roughly 5 mins per execution attempt proxy
    totalExecutions,
    favoriteLanguage,
    commonTimeComplexity,
    commonSpaceComplexity,
    dailyActivity,
    languageStats,
    unlockedAchievements: unlockedIds,
    user: {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Candidate',
      email: user.email || 'No Email'
    }
  }

  return (
    <CodingAnalyticsClient data={analyticsData} />
  )
}
