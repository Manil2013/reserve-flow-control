
import React from 'react';
import { EnhancedInput } from './EnhancedInput';

interface SmartInputProps extends React.ComponentProps<"input"> {
  context?: 'search' | 'legal' | 'procedure' | 'general';
  disableVoice?: boolean;
  disableSuggestions?: boolean;
}

export function SmartInput({ 
  context = 'general',
  disableVoice = false,
  disableSuggestions = false,
  ...props 
}: SmartInputProps) {
  return (
    <EnhancedInput
      {...props}
      enableVoice={!disableVoice}
      context={context}
      showVoiceButton={!disableVoice}
    />
  );
}
