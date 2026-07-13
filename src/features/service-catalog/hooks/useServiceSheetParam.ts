import { useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Service } from '../types/catalog';

const SHEET_PARAM = 'service';

interface ServiceSheetParam {
  /** The service the open sheet shows — undefined when closed or the id is unknown. */
  sheetService: Service | undefined;
  openSheet: (service: Service) => void;
  closeSheet: () => void;
}

/**
 * URL-driven bottom-sheet state (?service=<id>) — the browser/Android back
 * gesture closes the sheet and deep links restore it. Opening pushes a history
 * entry flagged with `state.sheet`, so closing pops it (back) when the app
 * created it and replace-clears the param on a deep link instead.
 */
function useServiceSheetParam(services: Service[]): ServiceSheetParam {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const sheetServiceId = searchParams.get(SHEET_PARAM);
  const sheetService = sheetServiceId
    ? services.find((candidate) => candidate.id === sheetServiceId)
    : undefined;

  const openSheet = useCallback(
    (service: Service) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(SHEET_PARAM, service.id);
          return next;
        },
        { preventScrollReset: true, state: { sheet: true } },
      );
    },
    [setSearchParams],
  );

  const closeSheet = useCallback(() => {
    if ((location.state as { sheet?: boolean } | null)?.sheet) {
      void navigate(-1);
    } else {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(SHEET_PARAM);
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    }
  }, [location.state, navigate, setSearchParams]);

  return { sheetService, openSheet, closeSheet };
}

export { useServiceSheetParam };
export type { ServiceSheetParam };
