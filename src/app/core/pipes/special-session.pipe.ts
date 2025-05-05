import { Pipe, PipeTransform } from '@angular/core';
import { SessionDetailsDto } from '../models/session/session.model';

/**
 * Returns true if a session is special/non-checkin (no speaker or common title keywords).
 */
@Pipe({
  name: 'specialSession',
  standalone: true
})
export class SpecialSessionPipe implements PipeTransform {
  transform(session: SessionDetailsDto): boolean {
    if (!session) {
      return false;
    }
    const title = session.title?.toLowerCase() ?? '';
    const speakerMissing = !session.speaker;
    const keywords = [
      'registration',
      'break',
      'breakfast',
      'lunch',
      'dinner',
      'coffee',
      'networking',
      'opening',
      'closing',
      'afterparty',
      'plenary',
      'intermission'
    ];
    const hasKeyword = keywords.some(kw => title.includes(kw));
    return speakerMissing || hasKeyword;
  }
} 