"use client";

import { useEffect } from "react";
import { trackEvent, type EventoTrade } from "@/lib/analitica/eventos";

export function TrackOnMount({
  evento,
  parametros = {},
}: {
  evento: EventoTrade;
  parametros?: Record<string, unknown>;
}) {
  useEffect(() => {
    trackEvent(evento, parametros);
    // Se dispara una sola vez al montar esta vista, no en cada cambio de props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
