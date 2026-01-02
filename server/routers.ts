import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserProjects } = await import('./db');
      return getUserProjects(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        studyType: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createProject } = await import('./db');
        return createProject(ctx.user.id, input);
      }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getProjectById } = await import('./db');
        return getProjectById(input.id, ctx.user.id);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        studyType: z.string().optional(),
        status: z.enum(['draft', 'in_progress', 'completed', 'archived']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const { updateProject } = await import('./db');
        return updateProject(id, ctx.user.id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteProject } = await import('./db');
        return deleteProject(input.id, ctx.user.id);
      }),
  }),

  sampleSize: router({
    calculate: protectedProcedure
      .input(z.object({
        testType: z.enum([
          'ttest-independent',
          'ttest-paired',
          'anova',
          'chi-square',
          'mann-whitney',
          'wilcoxon',
          'correlation',
          'log-rank'
        ]),
        alpha: z.number().min(0.001).max(0.5),
        power: z.number().min(0.5).max(0.999),
        effectSize: z.number().positive(),
        numGroups: z.number().int().positive().optional(),
        df: z.number().int().positive().optional(),
        ratio: z.number().positive().optional(),
        rho: z.number().min(-1).max(1).optional(),
        hazardRatio: z.number().positive().optional(),
        eventProbability: z.number().min(0).max(1).optional(),
      }))
      .mutation(async ({ input }) => {
        const stats = await import('../shared/statistics');
        
        switch (input.testType) {
          case 'ttest-independent':
            return stats.calculateTTestIndependent({
              alpha: input.alpha,
              power: input.power,
              effectSize: input.effectSize,
              ratio: input.ratio,
            });
          case 'ttest-paired':
            return stats.calculateTTestPaired({
              alpha: input.alpha,
              power: input.power,
              effectSize: input.effectSize,
            });
          case 'anova':
            return stats.calculateANOVA({
              alpha: input.alpha,
              power: input.power,
              effectSize: input.effectSize,
              numGroups: input.numGroups || 2,
            });
          case 'chi-square':
            return stats.calculateChiSquare({
              alpha: input.alpha,
              power: input.power,
              effectSize: input.effectSize,
              df: input.df || 1,
            });
          case 'mann-whitney':
            return stats.calculateMannWhitney({
              alpha: input.alpha,
              power: input.power,
              effectSize: input.effectSize,
              ratio: input.ratio,
            });
          case 'wilcoxon':
            return stats.calculateWilcoxon({
              alpha: input.alpha,
              power: input.power,
              effectSize: input.effectSize,
            });
          case 'correlation':
            return stats.calculateCorrelation({
              alpha: input.alpha,
              power: input.power,
              rho: input.rho || 0.3,
            });
          case 'log-rank':
            return stats.calculateLogRank({
              alpha: input.alpha,
              power: input.power,
              hazardRatio: input.hazardRatio || 2,
              eventProbability: input.eventProbability || 0.5,
            });
          default:
            throw new Error('Invalid test type');
        }
      }),

    save: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        testType: z.string(),
        parameters: z.string(),
        result: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { saveSampleSizeCalculation } = await import('./db');
        return saveSampleSizeCalculation({
          projectId: input.projectId,
          userId: ctx.user.id,
          testType: input.testType,
          parameters: input.parameters,
          result: input.result,
          notes: input.notes,
        });
      }),

    getProjectCalculations: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getProjectCalculations } = await import('./db');
        return getProjectCalculations(input.projectId);
      }),
  }),

  proposals: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        title: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createProposal } = await import('./db');
        return createProposal({
          projectId: input.projectId,
          userId: ctx.user.id,
          title: input.title,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        introduction: z.string().optional(),
        methods: z.string().optional(),
        results: z.string().optional(),
        discussion: z.string().optional(),
        references: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const { updateProposal } = await import('./db');
        return updateProposal(id, data);
      }),

    getProjectProposals: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getProjectProposals } = await import('./db');
        return getProjectProposals(input.projectId);
      }),

    generateOutline: protectedProcedure
      .input(z.object({
        researchQuestion: z.string(),
        studyType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import('./_core/llm');
        
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'You are a research methodology expert helping researchers create proposal outlines. Provide structured, detailed outlines following IMRAD format.'
            },
            {
              role: 'user',
              content: `Create a detailed research proposal outline for the following:\n\nResearch Question: ${input.researchQuestion}\nStudy Type: ${input.studyType}\n\nProvide a structured outline with key sections and bullet points for each section following IMRAD format (Introduction, Methods, Results, Analysis/Discussion).`
            }
          ]
        });

        return {
          outline: response.choices[0]?.message?.content || 'Failed to generate outline'
        };
      }),

    improveSection: protectedProcedure
      .input(z.object({
        section: z.string(),
        content: z.string(),
        instructions: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import('./_core/llm');
        
        const prompt = input.instructions 
          ? `Improve the following ${input.section} section based on these instructions: ${input.instructions}\n\n${input.content}`
          : `Improve the following ${input.section} section of a research proposal. Make it more clear, concise, and academically rigorous:\n\n${input.content}`;

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: 'You are an expert academic writer helping improve research proposals. Provide clear, well-structured improvements while maintaining scientific rigor.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        });

        return {
          improvedContent: response.choices[0]?.message?.content || 'Failed to improve content'
        };
      }),
  }),

  chat: router({
    createConversation: protectedProcedure
      .input(z.object({
        projectId: z.number().optional(),
        title: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createChatConversation } = await import('./db');
        return createChatConversation(ctx.user.id, input.projectId, input.title);
      }),

    getConversations: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserConversations } = await import('./db');
        return getUserConversations(ctx.user.id);
      }),

    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ input }) => {
        const { getConversationMessages } = await import('./db');
        return getConversationMessages(input.conversationId);
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        message: z.string(),
        context: z.object({
          projectInfo: z.string().optional(),
          studyType: z.string().optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import('./_core/llm');
        const { saveChatMessage, getConversationMessages } = await import('./db');
        
        // Save user message
        await saveChatMessage({
          conversationId: input.conversationId,
          role: 'user',
          content: input.message,
        });

        // Get conversation history
        const history = await getConversationMessages(input.conversationId);
        const messages = history.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));

        // Build system prompt with context
        let systemPrompt = `You are an expert research methodology assistant helping medical and clinical researchers. You provide guidance on study design, statistical analysis, research ethics, and proposal writing. Be clear, concise, and evidence-based in your responses.`;
        
        if (input.context?.projectInfo) {
          systemPrompt += `\n\nCurrent project context: ${input.context.projectInfo}`;
        }
        if (input.context?.studyType) {
          systemPrompt += `\n\nStudy type: ${input.context.studyType}`;
        }

        // Get AI response
        const response = await invokeLLM({
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ]
        });

        const assistantMessage = response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
        
        // Save assistant message
        await saveChatMessage({
          conversationId: input.conversationId,
          role: 'assistant',
          content: typeof assistantMessage === 'string' ? assistantMessage : JSON.stringify(assistantMessage),
        });

        return {
          message: assistantMessage
        };
      }),
  }),

  literature: router({
    search: protectedProcedure
      .input(z.object({
        query: z.string(),
        maxResults: z.number().min(1).max(100).default(20),
      }))
      .mutation(async ({ input }) => {
        const axios = (await import('axios')).default;
        
        try {
          // Search PubMed using E-utilities API
          const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
          const searchParams = {
            db: 'pubmed',
            term: input.query,
            retmax: input.maxResults,
            retmode: 'json',
            sort: 'relevance'
          };

          const searchResponse = await axios.get(searchUrl, { params: searchParams });
          const idList = searchResponse.data.esearchresult.idlist;

          if (!idList || idList.length === 0) {
            return { papers: [] };
          }

          // Fetch details for the papers
          const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`;
          const summaryParams = {
            db: 'pubmed',
            id: idList.join(','),
            retmode: 'json'
          };

          const summaryResponse = await axios.get(summaryUrl, { params: summaryParams });
          const results = summaryResponse.data.result;

          const papers = idList.map((id: string) => {
            const paper = results[id];
            if (!paper) return null;

            return {
              pmid: id,
              title: paper.title || 'No title',
              authors: paper.authors?.slice(0, 3).map((a: any) => a.name).join(', ') || 'Unknown',
              journal: paper.fulljournalname || paper.source || 'Unknown journal',
              year: paper.pubdate?.split(' ')[0] || 'Unknown',
              doi: paper.elocationid || '',
              url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
            };
          }).filter(Boolean);

          return { papers };
        } catch (error) {
          console.error('PubMed search error:', error);
          throw new Error('Failed to search PubMed');
        }
      }),

    save: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        pmid: z.string(),
        title: z.string(),
        authors: z.string(),
        journal: z.string(),
        year: z.number(),
        doi: z.string().optional(),
        url: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { savePaper } = await import('./db');
        return savePaper({
          projectId: input.projectId,
          userId: ctx.user.id,
          pubmedId: input.pmid,
          title: input.title,
          authors: input.authors,
          journal: input.journal,
          year: input.year,
          doi: input.doi,
          url: input.url,
          notes: input.notes,
        });
      }),

    getProjectPapers: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getProjectPapers } = await import('./db');
        return getProjectPapers(input.projectId);
      }),
  }),

  budget: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        categories: z.string(), // JSON string of categories
        totalAmount: z.number(),
        currency: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createBudget } = await import('./db');
        return createBudget({
          ...input,
          userId: ctx.user.id,
        });
      }),

    getProjectBudget: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getProjectBudget } = await import('./db');
        return getProjectBudget(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        budgetId: z.number(),
        categories: z.string().optional(),
        totalAmount: z.number().optional(),
        currency: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateBudget } = await import('./db');
        const { budgetId, ...data } = input;
        return updateBudget(budgetId, data);
      }),
  }),

  timeline: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        milestones: z.string(), // JSON string of milestones
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createTimelinePhase } = await import('./db');
        return createTimelinePhase({
          ...input,
          userId: ctx.user.id,
        });
      }),

    getProjectTimeline: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getProjectTimeline } = await import('./db');
        return getProjectTimeline(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        timelineId: z.number(),
        milestones: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateTimelinePhase } = await import('./db');
        const { timelineId, ...data } = input;
        return updateTimelinePhase(timelineId, data);
      }),

    delete: protectedProcedure
      .input(z.object({ timelineId: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteTimelinePhase } = await import('./db');
        return deleteTimelinePhase(input.timelineId);
      }),
  }),

  feedback: router({
    submit: protectedProcedure
      .input(z.object({
        type: z.enum(['bug', 'feature', 'feedback', 'question']),
        subject: z.string(),
        message: z.string(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { saveFeedback } = await import('./db');
        const { notifyOwner } = await import('./_core/notification');
        
        // Save feedback to database
        await saveFeedback({
          userId: ctx.user.id,
          type: input.type,
          subject: input.subject,
          message: input.message,
        });

        // Notify owner
        const typeLabel = {
          bug: '🐛 Bug Report',
          feature: '✨ Feature Request',
          question: '❓ Question',
          feedback: '💬 Feedback'
        }[input.type];

        await notifyOwner({
          title: `${typeLabel}: ${input.subject}`,
          content: `From: ${ctx.user.name || ctx.user.email || 'User'}\n\n${input.message}`
        });

        return { success: true };
      }),

    getUserFeedback: protectedProcedure
      .query(async ({ ctx }) => {
        const { getUserFeedback } = await import('./db');
        return getUserFeedback(ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
