
import { Style as PDFStyle } from '@react-pdf/stylesheet';
import { PageSize } from '@react-pdf/types';
import React from 'react';
import { HTMLProps } from '../html/HTML';

export interface HtmlToPdfProps {
    htmlProps?: HTMLProps;
    pageSize?: PageSize;
    margins?: PageMargins;
}

export interface HtmlToPdfViewerProps extends HtmlToPdfProps {
    width?: string | number,
    height?: string | number
}

export interface HeaderFooterProps {
    height?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingHorizontal?: number;
    style?: PDFStyle;
}

export interface PageMargins {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
