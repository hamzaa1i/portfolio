import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Note = CollectionEntry<'notes'>;

/** All projects in homepage order (featured first, by featuredOrder). */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.featuredOrder - b.data.featuredOrder);
}

/** Projects that appear on the homepage (featured only, ordered). */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.data.featured);
}

/** Next project in the featured cycle, for case-study footer navigation. */
export function getNextProject(current: Project, projects: Project[]): Project {
  const featured = projects.filter((p) => p.data.featured);
  const index = featured.findIndex((p) => p.id === current.id);
  if (index === -1) return featured[0];
  return featured[(index + 1) % featured.length];
}

/** All notes, newest first. */
export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes');
  return notes.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** Homepage selection: newest two. */
export async function getFeaturedNotes(): Promise<Note[]> {
  const notes = await getNotes();
  return notes.slice(0, 2);
}
